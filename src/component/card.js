import clsx from "clsx";
import { memo } from "react";
import StreamPlayButton from "component/streamPlayButton";
import Thumbnail from "component/thumbnail";
import { smoothGradient } from "util/core";
import Link from "component/link";
import { useNavigate } from "react-router-dom";
import { WEB_DOMAIN } from "constants.js";
import { useMediaQuery } from "react-responsive";
import useContextMenu from "hooks/useContextMenu";
import usePlayStream from "hooks/usePlayStream";

function CardItem(props) {
  const {
    id,
    index,
    title,
    queueTitle,
    queueData,
    label,
    metadata,
    subtitle,
    layout = "vertical",
    thumbnail = "",
    rawThumbnail,
    circularThumbnail,
    ...cardProps
  } = props;

  const navigate = useNavigate();
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  const showPlayButton =
    metadata && metadata.stream_type && !metadata.fee_amount;
  const isChannel = metadata && !metadata.stream_type && metadata.channel_type;
  const isStream = metadata && metadata.stream_type && metadata.channel_type;
  const isGenre = metadata && metadata.category_type;
  const isArtist =
    (metadata && metadata.result_type === "artist") ||
    (isChannel && metadata.channel_type === "artist");
  const isCircularThumbnail = circularThumbnail || isArtist;

  let href;
  let linkTo;
  let subLinkTo;

  if (isStream) {
    if (metadata.channel_type === "artist") {
      subLinkTo = `/artist/${metadata.channel_id}`;
    } else if (metadata.channel_type === "podcast_series") {
      subLinkTo = `/podcast/${metadata.channel_id}`;
    }
  }

  if (isChannel && metadata.channel_type === "artist") {
    linkTo = `/artist/${id || metadata.id}`;
  } else if (isChannel && metadata.channel_type === "podcast_series") {
    linkTo = `/podcast/${id || metadata.id}`;
  } else if (isGenre) {
    linkTo = `/genre/${metadata.label}`;
  } else if (metadata && metadata.stream_type) {
    href = `${WEB_DOMAIN}/${metadata.url}`;
  }
  const { play, selected } = usePlayStream({
    index,
    metadata,
    queueTitle,
    queueData,
  });

  const handleClick = (e) => {
    if (linkTo) {
      navigate(linkTo);
    } else if (isTabletOrMobile && isStream) {
      play(e);
    }
  };

  const handleContextMenu = useContextMenu(metadata);

  return (
    <div
      data-id={id}
      className={clsx(
        "card",
        layout && `card--${layout}`,
        selected && "card--selected"
      )}
      {...cardProps}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <Thumbnail
        className={clsx(
          "card__thumbnail",
          isCircularThumbnail && "card__thumbnail--circle"
        )}
        rawSrc={rawThumbnail}
        src={thumbnail}
      >
        {metadata && metadata.fee_amount > 0 && (
          <div className={"card__price-label"}>
            {`${metadata.fee_amount.toFixed(1)} ${metadata.fee_currency}`}
          </div>
        )}
        {showPlayButton && (
          <StreamPlayButton
            index={index}
            className={"card__play-button"}
            classNameActive={"card__play-button--active"}
            metadata={metadata}
            queueTitle={queueTitle}
            queueData={queueData}
            showPulse={true}
          />
        )}
      </Thumbnail>
      <div className="card__data">
        <Link
          className="card__title text-overflow"
          to={linkTo}
          href={href}
          title={title}
          target={href ? "_blank" : null}
        >
          {title}
        </Link>
        {subLinkTo ? (
          <Link className={"card__subtitle text-overflow"} to={subLinkTo}>
            {subtitle}
          </Link>
        ) : (
          <div className={"card__subtitle text-overflow"}>{subtitle}</div>
        )}
        {label && <div className={"card__label"}>{label}</div>}
      </div>
    </div>
  );
}

export const Card = memo(CardItem);

export function CategoryCardItem({ title, color }) {
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });
  const cardStyle = { backgroundColor: `rgb(${color})` };
  const thumbnailStyle = {
    backgroundImage: "url(/images/" + title.replace(/\s/g, "-") + ".jpg)",
  };
  const gradientOverlay = {
    background: smoothGradient(color, isTabletOrMobile ? 0.64 : 0.95),
  };
  const linkTo = title === "podcasts" ? "/podcasts" : `/genre/${title}`;
  return (
    <Link className="category-card" style={cardStyle} to={linkTo}>
      <div className="category-card__thumbnail" style={thumbnailStyle} />
      <div className="category-card__title" style={gradientOverlay}>
        {title}
      </div>
    </Link>
  );
}

export const CategoryCard = memo(CategoryCardItem);
