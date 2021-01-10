import clsx from "clsx";
import Icon from "@mdi/react";
import { DownloadLink, ExternalLink } from "components/externalLink";

const Button = ({
  label,
  type,
  icon,
  active,
  iconClassName,
  externalLink,
  downloadlLink,
  ...props
}) => {
  const classNames = clsx(
    "button",
    type && `button--${type}`,
    active && "button--active"
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
    <button className={classNames} {...props}>
      {icon && (
        <Icon path={icon} className={clsx("button__icon", iconClassName)} />
      )}
      {label && <span className="button__label">{label}</span>}
    </button>
  );
};

export default Button;
