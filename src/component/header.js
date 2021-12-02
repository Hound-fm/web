import Link from "component/link";
import Search from "component/search";
import Button from "component/button";
import clsx from "clsx";
import {
  Sun,
  Menu,
  Settings,
  Github,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
const GITHUB_LINK = "https://github.com/hound-fm/web";
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

export default function Header(props) {
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
        {isTabletOrMobile && (
          <Button className={"button--menu button--nav"} icon={Menu} />
        )}

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
      {!isTabletOrMobile && (
        <div className={"header__actions"}>
          {/*
          <Button icon={Github} className={"button--nav button--label"}>
            GitHub
          </Button>
          */}
        </div>
      )}
    </header>
  );
}
