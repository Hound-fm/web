import Search from "component/search";
import Button from "component/button";
import clsx from "clsx";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, memo } from "react";
import { useState as useHookState } from "@hookstate/core";
import { globalMobileAppState } from "store";

const MAX_SCROLL = 35;

const useIsOverlay = () => {
  const [overlay, setOverlay] = useState(false);

  const handleScroll = useCallback(
    (e) => {
      const top = e.target.scrollingElement.scrollTop;
      if (!overlay && top > MAX_SCROLL) {
        setOverlay(true);
      }
      if (overlay && top < MAX_SCROLL) {
        setOverlay(false);
      }
    },
    [overlay, setOverlay]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return overlay;
};

function MobileMenuButton() {
  const mobileAppState = useHookState(globalMobileAppState);
  const menuExpanded = mobileAppState.menuExpanded.value;

  const toggleMenu = () => {
    mobileAppState.menuExpanded.set((prev) => !prev);
  };

  return (
    <Button
      className={"button--menu button--nav"}
      icon={Menu}
      aria-expanded={menuExpanded}
      onClick={toggleMenu}
    />
  );
}

function Header(props) {
  const { title } = props;
  const overlay = useIsOverlay();
  const location = useLocation();
  const navigate = useNavigate();
  const showSearch = location.pathname === "/search";

  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  const navigateNext = () => {
    navigate(1);
  };

  const navigatePrev = () => {
    navigate(-1);
  };

  return (
    <header
      className={clsx(
        "header",
        isTabletOrMobile && "header--mobile",
        overlay && "overlay"
      )}
    >
      <div className={"header__actions"}>
        {!showSearch && isTabletOrMobile && <MobileMenuButton />}

        {!isTabletOrMobile && (
          <Button
            className={"button--nav"}
            icon={ChevronLeft}
            onClick={navigatePrev}
          />
        )}
        {!isTabletOrMobile && (
          <Button
            className={"button--nav"}
            icon={ChevronRight}
            onClick={navigateNext}
          />
        )}
        {title && <h1 className={"header__title"}>{title}</h1>}
        {showSearch && <Search />}
      </div>
    </header>
  );
}

export default memo(Header);
