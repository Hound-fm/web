import clsx from "clsx";
import Icon from "@mdi/react";
import { DownloadLink, ExternalLink } from "components/externalLink";
import { Button as BaseButton } from "reakit/Button";

const Button = ({
  label,
  type,
  icon,
  active,
  iconClassName,
  externalLink,
  downloadlLink,
  className,
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
    <BaseButton className={classNames} {...props}>
      {icon && (
        <Icon path={icon} className={clsx("button__icon", iconClassName)} />
      )}
      {label && <span className="button__label">{label}</span>}
    </BaseButton>
  );
};

export default Button;
