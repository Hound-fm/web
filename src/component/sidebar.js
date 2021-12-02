import Icon from "./icon";
import Logo from "../logo.svg";
import clsx from "clsx";
import Link from "component/link";

import { useMediaQuery } from "react-responsive";
import {
  Home,
  Music,
  Search,
  Heart,
  Podcast,
  BookOpen,
  Library,
} from "lucide-react";

function SidebarLink({ label, icon, ...props }) {
  return (
    <li className={"sidebar__link"}>
      <Link icon={icon} {...props}>
        {label}
      </Link>
    </li>
  );
}

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <img src={Logo} className={"logo"} aria-hidden />
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
  );
}
