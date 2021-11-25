import Icon from "component/icon";

import { Link, useMatch } from "react-router-dom";

const Anchor = ({ children, ...props }) => {
  return <a {...props}>{children}</a>;
};

export default function CustomLink({ icon, children, exact, ...props }) {
  let match = useMatch({
    path: props.to || "",
    exact,
  });

  const Wrapper = props.to ? Link : Anchor;
  return (
    <Wrapper aria-current={match ? "page" : null} {...props}>
      {icon && <Icon icon={icon} className={"icon link__icon"} />}
      {children && <span>{children}</span>}
    </Wrapper>
  );
}
