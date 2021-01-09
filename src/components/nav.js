import Icon from "@mdi/react";
import clsx from "clsx";
import { mdiMusic, mdiPodcast, mdiBookMusic, mdiCog } from "@mdi/js";

import { Link, useRouteMatch, useLocation } from "react-router-dom";

function Nav({ innerRoutes, title }) {
  const location = useLocation();
  const page = location.pathname.split("/")[1];
  const root = page && page.length ? `/${page}` : "";

  return (
    <header>
      {title && <h3 className={"header__title"}>{title}</h3>}
      <nav className="nav">
        {innerRoutes &&
          innerRoutes.length > 0 &&
          innerRoutes.map((route) => (
            <NavLink path={`${root}/${route.path}`} label={route.label} />
          ))}
      </nav>
    </header>
  );
}

function NavLink({ path, label, icon, exact }) {
  const match = useRouteMatch({ path, exact });

  return (
    <Link to={path} className={clsx("nav__link", match && "active")}>
      {icon && <Icon path={icon} className={"icon"} />}
      {label && <span>{label}</span>}
    </Link>
  );
}

function SidebarLink({ path, label, icon, exact }) {
  let match = useRouteMatch({ path, exact });
  return (
    <li className={clsx("sidebar__link", match && "sidebar__link--active")}>
      <Link to={path}>
        <Icon path={icon} className={"icon"} />
        <span>{label}</span>
      </Link>
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
        <SidebarLink icon={mdiMusic} label={"Music"} path={"/music"} />
        <SidebarLink icon={mdiPodcast} label={"Podcasts"} path={"/podcasts"} />
        <SidebarLink
          icon={mdiBookMusic}
          label={"Audiobooks"}
          path={"/audiobooks"}
        />
        <SidebarLink icon={mdiCog} label={"Settings"} path={"/settings"} />
      </ul>
    </div>
  );
}

export { Sidebar, Nav };
