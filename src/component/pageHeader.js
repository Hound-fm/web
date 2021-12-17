import clsx from "clsx";
import { memo, useEffect } from "react";
import useTitle from "hooks/useTitle";
import Thumbnail from "component/thumbnail";

function PageHeader(props) {
  const { title, subtitle, thumbnail, circularThumbnail } = props;
  const { setTitle } = useTitle();
  useEffect(() => {
    if (title) {
      setTitle(title);
    }
    // eslint-disable-next-line
  }, [title]);

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
