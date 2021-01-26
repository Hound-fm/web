import Icon from "@mdi/react";
import clsx from "clsx";
import { Button } from "components/button";
import { mdiMusic, mdiPodcast, mdiBookMusic, mdiCog, mdiMenu } from "@mdi/js";
import React from "react";
import { Link, useRouteMatch, useLocation } from "react-router-dom";

import {
  useDialogState,
  Dialog as BaseDialog,
  DialogDisclosure,
} from "reakit/Dialog";

function SidebarButton({ disclosure, ...props }) {
  const dialog = useDialogState();
  return (
    <>
      <DialogDisclosure {...dialog} ref={disclosure.ref} {...disclosure.props}>
        {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
      </DialogDisclosure>
      <BaseDialog {...dialog} {...props} />
    </>
  );
}

function Nav({ innerRoutes, title }) {
  const location = useLocation();
  const page = location.pathname.split("/")[1];
  const root = page && page.length ? `/${page}` : "";

  return (
    <header>
      <h3 className={"header__title"}>
        <SidebarButton
          disclosure={
            <Button icon={mdiMenu} type={"icon button--header-menu"} />
          }
        >
          {" "}
          <Sidebar />{" "}
        </SidebarButton>
        {title && <span>{title}</span>}
      </h3>
      <nav className="nav">
        {innerRoutes &&
          innerRoutes.length > 0 &&
          innerRoutes.map((route) => (
            <NavLink
              key={route.label}
              to={`${root}/${route.path}`}
              label={route.label}
            />
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

function Sidebar({ className }) {
  return (
    <div className={clsx("sidebar", className)}>
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
