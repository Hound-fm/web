import Icon from "@mdi/react";
import clsx from "clsx";
import { Button } from "components/button";
import { mdiMusic, mdiPodcast, mdiBookMusic, mdiCog, mdiMenu } from "@mdi/js";
import React from "react";
import { useLocation, NavLink as NavLinkBase } from "react-router-dom";

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
      <BaseDialog {...dialog} {...props} preventBodyScroll={false} />
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

const NavLink = React.memo(({ to, root, label, icon, exact }) => {
  const isActive = (match, location) => {
    const rootMatch = location.pathname.startsWith(root);
    return match || rootMatch;
  };

  return (
    <NavLinkBase
      to={to}
      className={"nav__link"}
      isActive={isActive}
      activeClassName={"nav__link--active"}
    >
      {icon && <Icon path={icon} className={"icon"} />}
      {label && <span>{label}</span>}
    </NavLinkBase>
  );
});

function Sidebar({ className }) {
  return (
    <div className={clsx("sidebar", className)}>
      <div className={"sidebar__header"}>
        <h2>Hound.fm</h2>
      </div>
      <ul>
        <NavLink
          icon={mdiMusic}
          label={"Music"}
          root={"/music"}
          to={"/music/latest"}
        />
        <NavLink
          icon={mdiPodcast}
          label={"Podcasts"}
          root="/podcasts"
          to={"/podcasts/latest"}
        />
        <NavLink
          icon={mdiBookMusic}
          label={"Audiobooks"}
          root={"/audiobooks"}
          to={"/audiobooks/latest"}
        />
        <NavLink icon={mdiCog} label={"Settings"} to={"/settings"} />
      </ul>
    </div>
  );
}

export { Sidebar, Nav };
