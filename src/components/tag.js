import clsx from "clsx";
import { Link, useRouteMatch } from "react-router-dom";

export const TagLink = ({ tag, exact, className }) => {
  const path = "/tags/" + tag;
  const match = useRouteMatch({ path, exact });

  return (
    <Link to={path} className={clsx("tag-link", className, match && "active")}>
      {tag && <span>{tag}</span>}
    </Link>
  );
};
