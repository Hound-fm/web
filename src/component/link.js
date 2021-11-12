import Icon from "component/icon";

import { Link, useMatch } from "react-router-dom";

export default function CustomLink({ icon, children, to, exact, ...props }) {
  let match = useMatch({
    path: to || "",
    exact,
  });

  return (
    <Link to={to || "/"} aria-current={match ? "page" : null} {...props}>
      {icon && <Icon icon={icon} className={"icon link__icon"} />}
      {children && <span>{children}</span>}
    </Link>
  );
}
