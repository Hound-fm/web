import clsx from "clsx";
import Thumbnail from "component/thumbnail";

export default function PageHeader(props) {
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
        {title && <h1 className="page__title">{title}</h1>}
        {subtitle && <p className="page__subtitle">{subtitle}</p>}
        {props.children}
      </div>
    </div>
  );
}
