import Icon from "@mdi/react";
import clsx from "clsx";
import { mdiMusic, mdiPodcast, mdiBookMusic, mdiCog } from "@mdi/js";
import React from "react";
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
            <NavLink to={`${root}/${route.path}`} label={route.label} />
          ))}
      </nav>
    </header>
  );
}

const NavLink = React.memo(({ to, label, icon, exact }) => {
  const match = useRouteMatch({ path: to, exact });

  return (
    <Link to={to} className={clsx("nav__link", match && "active")}>
      {icon && <Icon path={icon} className={"icon"} />}
      {label && <span>{label}</span>}
    </Link>
  );
});

const SidebarLink = React.memo(({ to, label, icon, exact }) => {
  let match = useRouteMatch({ path: to, exact });
  return (
    <li className={clsx("sidebar__link", match && "sidebar__link--active")}>
      <Link to={to}>
        <Icon path={icon} className={"icon"} />
        <span>{label}</span>
      </Link>
    </li>
  );
});

function Sidebar() {
  return (
    <div className="sidebar">
      <div className={"sidebar__header"}>
        <h2>Hound.fm</h2>
      </div>
      <ul>
        <SidebarLink icon={mdiMusic} label={"Music"} to={"/music"} />
        <SidebarLink icon={mdiPodcast} label={"Podcasts"} to={"/podcasts"} />
        <SidebarLink
          icon={mdiBookMusic}
          label={"Audiobooks"}
          to={"/audiobooks"}
        />
        <SidebarLink icon={mdiCog} label={"Settings"} to={"/settings"} />
      </ul>
    </div>
  );
}

export { Sidebar, Nav };
