import clsx from "clsx";
import { useEffect, useState } from "react";
import StreamPlayButton from "component/streamPlayButton";
import Thumbnail from "component/thumbnail";
import { smoothGradient } from "util/core";
import Link from "component/link";
import { useQueueUpdate } from "hooks/useQueue";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { globalPlayerState } from "store";
import { useNavigate, useLocation } from "react-router-dom";
import { WEB_DOMAIN } from "constants.js";

export function Card(props) {
  const {
    id,
    index,
    title,
    queueTitle,
    queueData,
    label,
    metadata,
    subtitle,
    circularThumbnail,
    layout = "vertical",
    thumbnail = "",
    rawThumbnail,
    ...cardProps
  } = props;

  const navigate = useNavigate();
  const showPlayButton =
    metadata && metadata.stream_type && !metadata.fee_amount;
  const isChannel = metadata && !metadata.stream_type && metadata.channel_type;
  const isGenre = metadata && metadata.category_type;

  let href;
  let linkTo;
  if (isChannel && metadata.channel_type === "artist") {
    linkTo = `/artist/${id || metadata.id}`;
  } else if (isGenre) {
    linkTo = `/genre/${metadata.label}`;
  } else if (metadata && metadata.stream_type) {
    href = `${WEB_DOMAIN}/${metadata.url}`;
  }

  const handleClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  return (
    <div
      data-id={id}
      className={clsx("card", layout && `card--${layout}`)}
      {...cardProps}
      onClick={handleClick}
    >
      <Thumbnail
        className={clsx(
          "card__thumbnail",
          circularThumbnail && "card__thumbnail--circle"
        )}
        rawSrc={rawThumbnail}
        src={thumbnail}
      >
        {showPlayButton && (
          <StreamPlayButton
            index={index}
            className={"card__play-button"}
            classNameActive={"card__play-button--active"}
            metadata={metadata}
            queueTitle={queueTitle}
            queueData={queueData}
          />
        )}
      </Thumbnail>
      <div className="card__data">
        <Link
          className="card__title text-overflow"
          to={linkTo}
          href={href}
          target={href ? "_blank" : null}
        >
          {title}
        </Link>
        {!isChannel && !isGenre ? (
          <Link
            className={"card__subtitle text-overflow"}
            to={`/artist/${metadata.channel_id}`}
          >
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

export function CategoryCard({ title, color }) {
  const cardStyle = { backgroundColor: `rgb(${color})` };
  const thumbnailStyle = {
    backgroundImage:
      "url(http://localhost:3000/images/" + title.replace(/\s/g, "-") + ".jpg)",
  };
  const gradientOverlay = { background: smoothGradient(color) };
  return (
    <Link className="category-card" style={cardStyle} to={`/genre/${title}`}>
      <div className="category-card__thumbnail" style={thumbnailStyle} />
      <div className="category-card__title" style={gradientOverlay}>
        <span>{title}</span>
      </div>
    </Link>
  );
}
