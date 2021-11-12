import clsx from "clsx";
import { useEffect, useState } from "react";
import Icon from "component/icon";
import Button from "component/button";
import Thumbnail from "component/thumbnail";
import { smoothGradient } from "util/core";
import { Play, Pause } from "component/customIcons";
import Link from "component/link";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { globalPlayerState } from "store";

function PlayButton({ index, metadata, queueTitle, queueData }) {
  const playerState = useHookState(globalPlayerState);
  const currentTrack = playerState.currentTrack.value;
  const playbackState = playerState.playbackState.value;
  const playbackStateSync = playerState.playbackStateSync.value;
  const selected = currentTrack && metadata && metadata.id == currentTrack.id;

  const handleClick = () => {
    if (metadata && !currentTrack) {
      playerState.playbackState.set("paused");
      playerState.currentTrack.set(metadata);
    } else if (metadata && currentTrack && metadata.id !== currentTrack.id) {
      playerState.playbackState.set("paused");
      playerState.currentTrack.set(metadata);
    } else if (
      metadata &&
      metadata.id === currentTrack.id &&
      !playbackStateSync
    ) {
      if (playbackState === "playing") {
        playerState.playbackStateSync.set("paused");
      } else if (playbackState == "paused") {
        playerState.playbackStateSync.set("playing");
      }
    }

    // Update queue

    if (queueTitle && queueData && queueData.hits && queueData.hits.length) {
      playerState.queueIndex.set(index);
      playerState.queueData.set(queueData.hits);
      playerState.queueTitle.set(queueTitle);
    }
  };

  let buttonIcon = playbackState === "playing" && selected ? Pause : Play;

  return (
    <Button
      icon={buttonIcon}
      className={clsx(
        "card__play-button",
        selected && "card__play-button--active"
      )}
      onClick={handleClick}
    />
  );
}

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
  const showPlayButton = metadata && !metadata.fee_amount;
  return (
    <div
      data-id={id}
      className={clsx("card", layout && `card--${layout}`)}
      {...cardProps}
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
          <PlayButton
            index={index}
            metadata={metadata}
            queueTitle={queueTitle}
            queueData={queueData}
          />
        )}
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
    <Link className="category-card" style={cardStyle} to={`/genre/${title}`}>
      <div className="category-card__thumbnail" style={thumbnailStyle} />
      <div className="category-card__title" style={gradientOverlay}>
        <span>{title}</span>
      </div>
    </Link>
  );
}
