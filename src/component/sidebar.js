import Logo from "../logo.svg";
import Link from "component/link";
import { memo } from "react";
import { Home, Heart, Search } from "lucide-react";

const SidebarLink = memo(({ label, icon, ...props }) => {
  return (
    <li className={"sidebar__link"}>
      <Link icon={icon} {...props}>
        {label}
      </Link>
    </li>
  );
});

function Sidebar() {
  return (
    <div className="sidebar">
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
  );
}

export default memo(Sidebar);
