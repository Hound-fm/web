import Icon from "@mdi/react";
import clsx from "clsx";
import { mdiMusic, mdiPodcast, mdiBookMusic, mdiCog } from "@mdi/js";

function Nav() {
  return (
    <header>
      <nav className="nav">
        {/* <a className="navbar-brand" href="/">Hound.fm</a> */}
        <a className="nav__link active" href="#">
          <span>Latest</span>
        </a>
        <a className="nav__link" href="#">
          <span>Popular</span>
        </a>
      </nav>
    </header>
  );
}

function SidebarLink({ label, icon, active }) {
  return (
    <li className={clsx("sidebar__link", active && "sidebar__link--active")}>
      <a>
        <Icon path={icon} className={"icon"} />
        <span>{label}</span>
      </a>
    </li>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <div className={"sidebar__header"}>
        <h2>Hound.fm</h2>
      </div>
      <ul>
        <SidebarLink icon={mdiMusic} label={"Music"} active={true} />
        <SidebarLink icon={mdiPodcast} label={"Podcasts"} />
        <SidebarLink icon={mdiBookMusic} label={"Audiobooks"} />
        <SidebarLink icon={mdiCog} label={"Settings"} />
      </ul>
    </div>
  );
}

export { Sidebar, Nav };
