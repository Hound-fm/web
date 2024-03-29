import clsx from "clsx";
import { memo } from "react";
import { durationTrackFormat } from "util/formatDuration";
import Link from "component/link";
import Thumbnail from "component/thumbnail";
import StreamPlayButton from "component/streamPlayButton";
import { WEB_DOMAIN } from "constants.js";
import { useState as useHookState } from "@hookstate/core";
import { globalPlayerState } from "store";
import { useMediaQuery } from "react-responsive";
import useContextMenu from "hooks/useContextMenu";

const TrackRow = memo(
  ({
    index,
    metadata,
    title,
    url,
    subtitle,
    duration,
    thumbnail,
    channel_id,
    isTabletOrMobile,
  }) => {
    const streamUrl = url ? `${WEB_DOMAIN}/${url}` : "";
    const playerState = useHookState(globalPlayerState);
    const handleContextMenu = useContextMenu(metadata);
    const currentTrack = playerState.currentTrack.value;
    const showPlayButton = metadata && !metadata.fee_amount;
    const selected =
      currentTrack && metadata && metadata.id === currentTrack.id;

    return (
      <div
        className={clsx(
          "tracks-list__row",
          selected && "tracks-list__row--selected"
        )}
        onContextMenu={handleContextMenu}
      >
        <div className="row__cell">
          <Thumbnail className="row__thumbnail" src={thumbnail}>
            {showPlayButton && (
              <StreamPlayButton
                index={index}
                className={"thumbnail__play-button"}
                classNameActive={"thumbnail__play-button--active"}
                metadata={metadata}
                queueTitle={"queueTitle"}
                queueData={null}
              />
            )}
          </Thumbnail>
          <div className="row__data">
            <Link
              href={streamUrl}
              target={"_blank"}
              className="row__title text-overflow"
            >
              {title}
            </Link>
            <Link
              className="row__subtitle text-overflow"
              to={`/artist/${channel_id}`}
            >
              {subtitle}
            </Link>
          </div>
        </div>
        {!isTabletOrMobile && (
          <div className="row__cell">
            <div className="row__metadata">{durationTrackFormat(duration)}</div>
          </div>
        )}
      </div>
    );
  }
);

function TrackListPreview({ tracksData }) {
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  return (
    <div className="tracks-list-preview">
      {tracksData.map((data, index) => (
        <TrackRow
          key={data.id}
          url={data.url}
          index={index}
          metadata={data}
          channel_id={data.channel_id}
          title={data.title}
          subtitle={data.channel_title}
          duration={data.duration}
          thumbnail={data.thumbnail}
          isTabletOrMobile={isTabletOrMobile}
        />
      ))}
    </div>
  );
}

export default memo(TrackListPreview);
