import clsx from "clsx";
import { Link, useRouteMatch, useLocation } from "react-router-dom";

const formatPath = (pathname) => {
  let path = pathname;
  const last = path.slice(-1);
  if (last === "/") {
    path = path.slice(0, -1);
  }
  return path;
};

export const TagLink = ({ tag, className }) => {
  const location = useLocation();
  const path = formatPath(location.pathname) + "?tag=" + tag;
  const match = location.pathname + location.search === path;

  return (
    <Link to={path} className={clsx("tag-link", className, match && "active")}>
      {tag && <span>{tag}</span>}
    </Link>
  );
};
