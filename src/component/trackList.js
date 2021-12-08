import clsx from "clsx";
import React, { memo, useRef, useState, useEffect } from "react";
import { durationTrackFormat, durationShortFormat } from "util/formatDuration";
import memoize from "memoize-one";
import Thumbnail from "component/thumbnail";
import { FixedSizeList as List, areEqual } from "react-window";
import { WindowScroller } from "react-virtualized";
import useResizeObserver from "@react-hook/resize-observer";
import Link from "component/link";
import { useState as useHookState } from "@hookstate/core";
import { globalPlayerState } from "store";
import { WEB_DOMAIN } from "constants.js";
import StreamPlayButton from "component/streamPlayButton";
import FavoriteButton from "component/favoriteButton";
import { useMediaQuery } from "react-responsive";
import useContextMenu from "hooks/useContextMenu";

// If list items are expensive to render,
// Consider using React.memo or shouldComponentUpdate to avoid unnecessary re-renders.
// https://reactjs.org/docs/react-api.html#reactmemo
// https://reactjs.org/docs/react-api.html#reactpurecomponent

const Row = memo(({ data, index, style }) => {
  // Data passed to List as "itemData" is available as props.data
  const { items, queueTitle, startIndex, isTabletOrMobile } = data;
  const metadata = items[index];
  const playerState = useHookState(globalPlayerState);
  const currentTrack = playerState.currentTrack.value;
  const selected = currentTrack && metadata && metadata.id === currentTrack.id;
  const showPlayButton = metadata && !metadata.fee_amount;
  const streamUrl = metadata ? `${WEB_DOMAIN}/${metadata.url}` : "";
  const queueData = queueTitle ? items : null;
  const handleContextMenu = useContextMenu(metadata);

  return (
    <div
      className={clsx(
        "tracks-list__row",
        selected && "tracks-list__row--selected"
      )}
      style={style}
      onContextMenu={handleContextMenu}
    >
      <div className="row__cell">
        {!isTabletOrMobile && (
          <div className="row__data">
            {showPlayButton && (
              <StreamPlayButton
                index={index + startIndex}
                className={"button--play-row"}
                classNameActive={"button--play-row--active"}
                metadata={metadata}
                queueTitle={queueTitle}
                queueData={queueData}
              />
            )}
            <div className="row__index">{index + startIndex + 1}</div>
          </div>
        )}

        <Thumbnail className="row__thumbnail" src={metadata.thumbnail} />
        <div className="row__data">
          <Link
            className="row__title text-overflow"
            href={streamUrl}
            target={"_blank"}
          >
            {metadata.title}
          </Link>
          <Link
            className="row__subtitle text-overflow"
            to={`/artist/${metadata.channel_id}`}
          >
            {metadata.channel_title}
          </Link>
        </div>
      </div>
      {!isTabletOrMobile && (
        <div className="row__cell">
          <div
            className={clsx(
              "row__metadata row__price",
              !metadata || (!metadata.fee_amount && "row__price--free")
            )}
          >
            {metadata && metadata.fee_amount
              ? `${metadata.fee_amount.toFixed(1)} ${metadata.fee_currency}`
              : ""}
          </div>
          <div className="row__metadata">
            <FavoriteButton
              id={metadata.id}
              className={
                "button--text button--favorite  button--player-action  button--row-action"
              }
              favoriteType={metadata.stream_type}
            />
          </div>

          <div className="row__metadata row__end">
            {durationTrackFormat(metadata.duration)}
          </div>
        </div>
      )}
    </div>
  );
}, areEqual);

// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.

const createItemData = memoize(
  (items, queueTitle, startIndex, isTabletOrMobile) => ({
    items,
    queueTitle,
    startIndex,
    isTabletOrMobile,
  })
);

// In this example, "items" is an Array of objects to render,
// and "toggleItemActive" is a function that updates an item's state.

function TrackList({
  trackData,
  title,
  description,
  queueTitle,
  startIndex = 0,
}) {
  const listRef = useRef();
  const containerRef = useRef();
  const [width, setWidth] = useState(100);
  const [duration, setDuration] = useState(0);
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });
  // Bundle additional data to list items using the "itemData" prop.
  // It will be accessible to item renderers as props.data.
  // Memoize this data to avoid bypassing shouldComponentUpdate().
  const itemData = createItemData(
    trackData.map((track) => {
      if (track && track._source && track._id) {
        const data = track._source;
        data.id = track._id;
        return data;
      }
      return track;
    }),
    queueTitle,
    startIndex,
    isTabletOrMobile
  );

  const handleScroll = ({ scrollTop }) => {
    if (listRef && listRef.current) {
      listRef.current.scrollTo(scrollTop);
    }
  };

  useEffect(() => {
    let totalDuration = 0;
    trackData.forEach((item, i) => {
      if (item && item.duration) {
        totalDuration += item.duration;
      } else if (item && item._source && item._source.duration) {
        totalDuration += item._source.duration;
      }
    });
    setDuration(totalDuration ? durationShortFormat(totalDuration) : null);
  }, [trackData, trackData.length, setDuration]);

  useResizeObserver(containerRef, (entry) => {
    setWidth(entry.contentRect.width);
  });

  return (
    <>
      {title && <h1 className="tracks-list__title">{title}</h1>}
      {(description || (trackData.length && duration)) && (
        <h4 className={"tracks-list__description"}>
          {description || `${trackData.length} tracks •  ${duration}`}
        </h4>
      )}
      <div ref={containerRef} className="tracks-list__container">
        <WindowScroller onScroll={handleScroll}>{() => <div />}</WindowScroller>
        <List
          ref={listRef}
          width={width}
          height={trackData.length * 64}
          itemCount={trackData.length}
          itemData={itemData}
          itemSize={64}
          className="tracks-list window-scroller-override"
        >
          {Row}
        </List>
      </div>
    </>
  );
}

export default memo(TrackList);
