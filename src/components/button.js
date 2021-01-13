import clsx from "clsx";
import { memo, useCallback } from "react";
import Icon from "@mdi/react";
import { DownloadLink, ExternalLink } from "components/externalLink";
import { Button as BaseButton } from "reakit/Button";
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton,
  MenuSeparator,
} from "reakit/Menu";

export const Button = memo(
  ({
    label,
    type,
    icon,
    active,
    iconClassName,
    externalLink,
    downloadlLink,
    className,
    children,
    ...props
  }) => {
    const classNames = clsx(
      "button",
      type && `button--${type}`,
      active && "button--active",
      className
    );

    if (externalLink) {
      return (
        <ExternalLink path={externalLink} className={classNames}>
          {icon && (
            <Icon path={icon} className={clsx("button__icon", iconClassName)} />
          )}
          {label && <span className="button__label">{label}</span>}
        </ExternalLink>
      );
    }

    if (downloadlLink) {
      return (
        <DownloadLink path={downloadlLink} className={classNames}>
          {icon && (
            <Icon path={icon} className={clsx("button__icon", iconClassName)} />
          )}
          {label && <span className="button__label">{label}</span>}
        </DownloadLink>
      );
    }

    return (
      <BaseButton className={classNames} label={label} {...props}>
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

export const ButtonMenu = memo(
  ({ icon, label, iconClassName, type, className, items }) => {
    const menu = useMenuState({
      placement: "bottom-end",
      currrentId: items[0].id,
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
      (itemProps) => (
        <button {...itemProps} className={itemClassNames} onClick={onClick}>
          <span className={"button__label"}>{itemProps.title}</span>
        </button>
      ),
      []
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
          {items.map(({ title, id, tabIndex }) => (
            <MenuItem {...menu} key={id} id={id} title={title}>
              {children}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }
);
