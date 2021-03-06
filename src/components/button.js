import clsx from "clsx";
import { memo, forwardRef, useCallback } from "react";
import Icon from "@mdi/react";
import { DownloadLink, ExternalLink } from "components/externalLink";
import { Button as BaseButton } from "reakit/Button";
import { NavLink } from "react-router-dom";
import { useMenuState, Menu, MenuItem, MenuButton } from "reakit/Menu";

const ForwardButton = forwardRef(
  (
    {
      label,
      type,
      icon,
      active,
      iconClassName,
      externalLink,
      downloadlLink,
      className,
      children,
      routeLink,
      ...props
    },
    ref
  ) => {
    const classNames = clsx(
      "button",
      type && `button--${type}`,
      active && "button--active",
      className
    );

    if (routeLink) {
      return (
        <NavLink
          to={routeLink}
          className={classNames}
          activeClassName={"button--active"}
        >
          {icon && (
            <Icon path={icon} className={clsx("button__icon", iconClassName)} />
          )}
          {label && <span className="button__label">{label}</span>}
        </NavLink>
      );
    }

    if (externalLink) {
      return (
        <ExternalLink to={externalLink} className={classNames}>
          {icon && (
            <Icon path={icon} className={clsx("button__icon", iconClassName)} />
          )}
          {label && <span className="button__label">{label}</span>}
        </ExternalLink>
      );
    }

    if (downloadlLink) {
      return (
        <DownloadLink to={downloadlLink} className={classNames}>
          {icon && (
            <Icon path={icon} className={clsx("button__icon", iconClassName)} />
          )}
          {label && <span className="button__label">{label}</span>}
        </DownloadLink>
      );
    }

    return (
      <BaseButton
        ref={ref}
        className={classNames}
        label={label}
        focusable
        {...props}
      >
        {icon && (
          <Icon path={icon} className={clsx("button__icon", iconClassName)} />
        )}
        {(label || children) && (
          <span className="button__label">{children || label}</span>
        )}
      </BaseButton>
    );
  }
);

export const Button = memo(ForwardButton);

const MENU_GUTTER = 20;

export const ButtonMenu = memo(
  ({ icon, label, iconClassName, type, className, items }) => {
    const menu = useMenuState({
      placement: "bottom-end",
      gutter: MENU_GUTTER,
    });
    const classNames = clsx(
      "button",
      type && `button--${type}`,
      menu.visible && "button--active",
      className
    );

    const itemClassNames = clsx("button", "button--menu-item");

    const onClick = useCallback(
      (event) => {
        if (items && items.length > 0) {
          const id = event.currentTarget.id;
          const selected = items.find((item) => item.id === id);

          if (selected && selected.action) {
            selected.action();
          }
          menu.hide();
        }
      },
      [menu, items]
    );

    const children = useCallback(
      (itemProps) => {
        const { externalLink, ...props } = itemProps;
        if (externalLink) {
          return (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClassNames}
              onClick={onClick}
              {...props}
            >
              <span className={"button__label"}>{props.title}</span>
            </a>
          );
        }
        return (
          <button {...props} className={itemClassNames} onClick={onClick}>
            <span className={"button__label"}>{itemProps.title}</span>
          </button>
        );
      },
      [itemClassNames, onClick]
    );

    return (
      <>
        <MenuButton {...menu} className={classNames}>
          {icon && (
            <Icon path={icon} className={clsx("button__icon", iconClassName)} />
          )}
          {label && <span className="button__label">{label}</span>}
        </MenuButton>
        <Menu className={"menu"} {...menu} aria-label="Preferences">
          {items.map(({ id, action, ...itemProps }) => (
            <MenuItem {...menu} key={id} id={id} {...itemProps}>
              {children}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }
);
