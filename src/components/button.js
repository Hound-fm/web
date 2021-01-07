import clsx from "clsx";
import Icon from "@mdi/react";

const Button = ({ label, icon, type }) => {
  return (
    <button className={clsx("button", type && `button--${type}`)}>
      {icon && <Icon path={icon} className="button__icon" />}
      {label && <span className="button__label">{label}</span>}
    </button>
  );
};

export default Button;
