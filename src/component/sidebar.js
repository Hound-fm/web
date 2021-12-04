import Logo from "../logo.svg";
import Link from "component/link";
import { memo, useEffect } from "react";
import { Home, Heart, Search } from "lucide-react";
import { useState as useHookState } from "@hookstate/core";
import { globalMobileAppState } from "store";
import { useMediaQuery } from "react-responsive";

const SidebarLink = memo(({ label, icon, ...props }) => {
  const mobileAppState = useHookState(globalMobileAppState);
  const closeSidebar = () => {
    mobileAppState.menuExpanded.set(false);
  };
  return (
    <li className={"sidebar__link"}>
      <Link icon={icon} onClick={closeSidebar} {...props}>
        {label}
      </Link>
    </li>
  );
});

function Sidebar() {
  const mobileAppState = useHookState(globalMobileAppState);
  const open = mobileAppState.menuExpanded.value;
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  const closeSidebar = () => {
    mobileAppState.menuExpanded.set(false);
  };

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
        className="sidebar__overlay nonselectable"
        data-open={open}
        onClick={closeSidebar}
      />
      <div className="sidebar nonselectable" data-open={open}>
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
          >
            LBRY
          </Link>
        </p>
      </div>
    </>
  );
}

export default memo(Sidebar);
