import { memo } from "react";
import Icon from "component/icon";

function Button({ icon, children, onClick, ...props }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {icon && <Icon icon={icon} className={"icon button__icon"} />}
      {children && <span>{children}</span>}
    </button>
  );
}

export default memo(Button);
