import clsx from "clsx";
import Icon from "component/icon";
import Button from "component/button";
import Thumbnail from "component/thumbnail";
import { smoothGradient } from "util/core";
import { Play } from "component/customIcons"
import Link from "component/link"

function PlayButton(props) {
  return <Button icon={Play} className="card__play-button"/>
}

export function Card(props) {
  const {
    title,
    label,
    subtitle,
    circularThumbnail,
    layout = "vertical",
    thumbnail = "",
    rawThumbnail,
    ...cardProps
  } = props;
  return (
    <div className={clsx("card", layout && `card--${layout}`)} {...cardProps}>
      <Thumbnail
        className={clsx(
          "card__thumbnail",
          circularThumbnail && "card__thumbnail--circle"
        )}
        rawSrc={rawThumbnail}
        src={thumbnail}
      >
          <PlayButton />
      </Thumbnail>
      <div className="card__data">

        <div className="card__title text-overflow" tabIndex={0}>
          {title}
        </div>
        <div className={"card__subtitle text-overflow"}>{subtitle}</div>
        {label && <div className={"card__label"}>{label}</div>}
      </div>
    </div>
  );
}

export function CategoryCard({ title, color }) {
  const cardStyle = { backgroundColor: `rgb(${color})` };
  const thumbnailStyle = {
    backgroundImage: "url(http://localhost:3000/images/" + title + ".jpg)",
  };
  const gradientOverlay = { background: smoothGradient(color) };
  return (
    <Link className="category-card" style={cardStyle} to={`genre/${title}`}>
      <div className="category-card__thumbnail" style={thumbnailStyle} />
      <div className="category-card__title" style={gradientOverlay}>
        <span>{title}</span>
      </div>
    </Link>
  );
}
