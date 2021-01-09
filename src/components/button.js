import clsx from "clsx";
import Icon from "@mdi/react";
import { DownloadLink, ExternalLink } from "components/externalLink";

const Button = ({ label, icon, type, externalLink, downloadlLink }) => {
  if (externalLink) {
    return (
      <ExternalLink
        path={externalLink}
        className={clsx("button", type && `button--${type}`)}
      >
        {icon && <Icon path={icon} className="button__icon" />}
        {label && <span className="button__label">{label}</span>}
      </ExternalLink>
    );
  }

  if (downloadlLink) {
    return (
      <DownloadLink
        path={downloadlLink}
        className={clsx("button", type && `button--${type}`)}
      >
        {icon && <Icon path={icon} className="button__icon" />}
        {label && <span className="button__label">{label}</span>}
      </DownloadLink>
    );
  }

  return (
    <button className={clsx("button", type && `button--${type}`)}>
      {icon && <Icon path={icon} className="button__icon" />}
      {label && <span className="button__label">{label}</span>}
    </button>
  );
};

export default Button;
