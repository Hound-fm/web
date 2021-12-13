import clsx from "clsx";
import { memo } from "react";
import Thumbnail from "component/thumbnail";

function PageHeader(props) {
  const { title, subtitle, thumbnail, circularThumbnail } = props;
  return (
    <div className="page__header">
      <Thumbnail
        className={clsx(
          "header__thumbnail",
          circularThumbnail && "header__thumbnail--circle"
        )}
        src={thumbnail}
      />
      <div className="page__metadata">
        {title && <h1 className="page__title text-overflow-2">{title}</h1>}
        {subtitle && <p className="page__subtitle text-overflow">{subtitle}</p>}
        {props.children}
      </div>
    </div>
  );
}

export default memo(PageHeader);
