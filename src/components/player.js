import { Button } from "./button";
import Slider from "rc-slider";
import Thumbnail from "components/thumbnail";
import useAudioPlayer from "hooks/useAudioPlayer";
import { getStreamLink } from "utils/lbryplayer";
import { usePlayerState } from "store/playerContext";
import { useRef, useState, useEffect } from "react";
import { durationTrackFormat } from "utils/format.js";

import {
  mdiSkipNext,
  mdiShuffle,
  mdiPlaylistMusic,
  mdiDotsHorizontal,
  mdiPlayCircle,
  mdiSkipPrevious,
  mdiPlayCircleOutline,
  mdiPauseCircle,
  mdiRepeat,
  mdiVolumeHigh,
  mdiLoading,
  mdiRepeatOnce,
} from "@mdi/js";

import "rc-slider/assets/index.css";

function TrackInfo() {
  const { title, name, id, author, thumbnail } = usePlayerState();
  return (
    <div className={"track-info"}>
      <div className={"track-info__thumbnail"}>
        <Thumbnail src={thumbnail} className={"thumbnail--tiny"} />
      </div>
      <div className={"track-info__metadata"}>
        <div className={"track-info__metadata__title"}>{title}</div>
        <div className={"track-info__metadata__channel"}>{author}</div>
      </div>
    </div>
  );
}

const defaultDurationFormat = "0:00";

function PlayerSilder({ currentTime, seek, duration }) {
  const [next, setNext] = useState(currentTime);
  const [userSeeking, setUserSeeking] = useState(false);

  const handleBefore = () => {
    setUserSeeking(true);
  };

  const handleAfter = () => {
    seek(next);
    setUserSeeking(false);
  };

  const handleChange = (value) => {
    setNext(value);
  };

  useEffect(() => {
    if (!userSeeking) {
      if (currentTime !== next) {
        setNext(currentTime);
      }
    }
  }, [userSeeking, currentTime, next, setNext]);

  return (
    <div className={"player__slider"}>
      <span>{durationTrackFormat(next) || defaultDurationFormat}</span>
      <Slider
        value={next}
        step={1}
        min={0}
        max={duration}
        defaultValue={0}
        included={true}
        onBeforeChange={handleBefore}
        onAfterChange={handleAfter}
        onChange={handleChange}
      />
      <span>
        {(duration && durationTrackFormat(duration)) || defaultDurationFormat}
      </span>
    </div>
  );
}

function Player() {
  const { name, id, fakeDuration } = usePlayerState();
  const {
    audioRef,
    seek,
    togglePlay,
    playing,
    paused,
    loop,
    toggleLoop,
    ready,
    source,
    loading,
    duration,
    currentTime,
    durationFormated,
  } = useAudioPlayer();

  return (
    <div className={"player"}>
      <audio ref={audioRef} type="audio/wav" src={source} />
      <TrackInfo />
      <div className="player__controls">
        <div className={"player__controls__buttons"}>
          <Button icon={mdiSkipPrevious} type="player-control" />
          <Button
            icon={
              loading ? mdiLoading : playing ? mdiPauseCircle : mdiPlayCircle
            }
            type="player-control-main"
            iconClassName={loading && "animated--spin"}
            disabled={loading || !ready}
            onClick={togglePlay}
          />
          <Button icon={mdiSkipNext} type="player-control" />
        </div>

        <PlayerSilder
          seek={seek}
          currentTime={currentTime}
          duration={duration || fakeDuration}
          durationFormated={durationFormated}
        />

        <div className={"player__controls__buttons"}>
          <Button
            active={loop}
            icon={loop === "once" ? mdiRepeatOnce : mdiRepeat}
            type="player-control"
            onClick={toggleLoop}
          />
          <Button icon={mdiVolumeHigh} type="player-control" />
        </div>
      </div>
      <div className={"playlist-info"}>
        <Button icon={mdiPlaylistMusic} label={"Queue"} type={"large"} />
        <Button icon={mdiDotsHorizontal} type={"icon-large"} />
      </div>
    </div>
  );
}

export default Player;
