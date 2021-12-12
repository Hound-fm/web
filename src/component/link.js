import { memo } from "react";
import Icon from "component/icon";
import { Link, useMatch } from "react-router-dom";

const Anchor = ({ children, ...props }) => {
  return <a {...props}>{children}</a>;
};

function CustomLink({ icon, children, exact, onClick, draggable, ...props }) {
  let match = useMatch({
    path: props.to || "",
    exact,
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  const stopDragging = (e) => {
    if (!draggable) {
      e.preventDefault();
    }
  };

  const Wrapper = props.to ? Link : Anchor;
  return (
    <Wrapper
      onClick={handleClick}
      aria-current={match ? "page" : null}
      onDragStart={stopDragging}
      rel={props.href ? "noreferrer noopener" : null}
      {...props}
    >
      {icon && <Icon icon={icon} className={"icon link__icon"} />}
      {children && <span>{children}</span>}
    </Wrapper>
  );
}

export default memo(CustomLink);
