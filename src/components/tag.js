import clsx from "clsx";
import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";

const formatPath = (pathname) => {
  let path = pathname;
  const last = path.slice(-1);
  if (last === "/") {
    path = path.slice(0, -1);
  }
  return path;
};

export const TagLink = ({ tag, className, activeOnMatch = true }) => {
  const location = useLocation();
  const path = formatPath(location.pathname) + "?genre=" + tag;
  const match = activeOnMatch && location.pathname + location.search === path;

  return (
    <Link to={path} className={clsx("tag-link", className, match && "active")}>
      {tag && <span className={"text-overflow--short"}>{tag}</span>}
    </Link>
  );
};

export const TagsGroup = memo(({ title, tags }) => {
  return (
    <>
      <h3 className="title title--side">
        <span>{title}</span>
        <Link className={"sublink"} to="genres">
          SEE ALL <Icon path={mdiChevronRight} className={"sublink__icon"} />{" "}
        </Link>
      </h3>
      <div className="tags">
        {tags.map((tag) => (
          <TagLink key={tag} tag={tag} activeOnMatch />
        ))}
      </div>
    </>
  );
});
