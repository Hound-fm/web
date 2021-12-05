import Logo from "../logo.svg";
import Link from "component/link";
import { memo, useEffect, useRef, useState } from "react";
import { Home, Heart, Search } from "lucide-react";
import { useState as useHookState } from "@hookstate/core";
import { globalMobileAppState } from "store";
import { useMediaQuery } from "react-responsive";
import { clamp } from "util/core";

const SidebarLink = memo(({ label, icon, ...props }) => {
  const mobileAppState = useHookState(globalMobileAppState);
  const closeSidebar = () => {
    mobileAppState.menuExpanded.set(false);
  };

  return (
    <li className={"sidebar__link"}>
      <Link icon={icon} onClick={closeSidebar} {...props} draggable={false}>
        {label}
      </Link>
    </li>
  );
});

function findMainTouch(changedTouches) {
  for (let i = 0; i < changedTouches.length; i++) {
    if (changedTouches[i].identifier === 0) {
      return changedTouches[i]
    }
  }
  return false;
}


function Sidebar() {
  const sidebarRef = useRef();
  const mobileAppState = useHookState(globalMobileAppState);
  const open = mobileAppState.menuExpanded.value;
  const [, setLastPointerX] = useState(false);
  const [translateX, setTranslateX] = useState(false);

  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  const closeSidebar = (e) => {
    if (e) {
      e.stopPropagation();
    }
    mobileAppState.menuExpanded.set(false);
  };

  const onTouchMove = (e) => {
    e.preventDefault()
    const mainTouch = findMainTouch(e.changedTouches)
    if (mainTouch) {
      setLastPointerX((prev) => {
        if (prev || prev === 0) {
          const bounds = sidebarRef.current.getBoundingClientRect();
          const width = bounds.width;
          const next = clamp(mainTouch.pageX - prev, -width, 0);
          setTranslateX(`translate3d(${next}px, 0, 0)`);
        }
        return prev;
      });
    }
  }

  const onTouchStart = (e) => {
    const expanded = mobileAppState.menuExpanded.value;
    if (!expanded) {
      // Prevent interaction if sidebar is closed
      return;
    }

    const mainTouch = findMainTouch(e.changedTouches);
    if (mainTouch) {
      const bounds = sidebarRef.current.getBoundingClientRect();
      setLastPointerX(mainTouch.clientX - bounds.left);
      document.documentElement.ontouchmove = onTouchMove;
    }
  }

  const onTouchEnd = (e) => {
    const mainTouch = findMainTouch(e.changedTouches)
    if (mainTouch) {
      setTranslateX(false);
      document.documentElement.ontouchmove = null;
      const bounds = sidebarRef.current.getBoundingClientRect();
      if (bounds.left <= -bounds.width / 2) {
        // Close sidebar
        closeSidebar();
      }
    }
  }


  useEffect(() => {
    // Mobile support
    document.documentElement.addEventListener("touchstart", onTouchStart);
    document.documentElement.addEventListener("touchend", onTouchEnd);

    return () => {
      // Mobile support
      document.documentElement.removeEventListener("touchstart", onTouchStart);
      document.documentElement.addEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isTabletOrMobile) {
      mobileAppState.menuExpanded.set(false);
    }
    // mobileAppState is not a dependency and should be excluded from the array:
    // eslint-disable-next-line
  }, [isTabletOrMobile]);

  return (
    <>
      <div
        id={"SIDEBAR_OVERLAY"}
        className="sidebar__overlay nonselectable"
        data-open={open}
        onClick={closeSidebar}
      />
      <div
        className="sidebar nonselectable"
        data-open={open}
        ref={sidebarRef}
        style={{
          transform: translateX ? translateX : null,
          transition: translateX ? "none" : null,
        }}
      >
        <div className="sidebar__header">
          <img alt="" src={Logo} className={"logo"} aria-hidden />
          <span>Hound.fm</span>
        </div>
        <ul>
          <SidebarLink to={"/"} exact icon={Home} label={"Home"} />
          <SidebarLink to={"/search"} icon={Search} label={"Search"} />
          {/*
        <SidebarLink icon={Music} label={"Music"} current />
        <SidebarLink icon={Podcast} label={"Podcats"} />
        <SidebarLink icon={BookOpen} label={"Audiobooks"} />
        */}
          <SidebarLink to={"/favorites"} icon={Heart} label={"Favorites"} />
        </ul>
        <p className={"sidebar__message"}>
          Powered by
          <Link
            className="sidebar__message-link"
            href={"https://lbry.com"}
            target="_blank"
            draggable={false}
          >
            LBRY
          </Link>
        </p>
      </div>
    </>
  );
}

export default memo(Sidebar);
