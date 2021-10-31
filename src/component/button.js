import Icon from "component/icon";

export default function Button({ icon, children, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
  };
  return (
    <button onClick={handleClick} {...props}>
      {icon && <Icon icon={icon} className={"icon button__icon"} />}
      {children && <span>{children}</span>}
    </button>
  );
}
