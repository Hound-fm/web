import { Button } from "./button";
import Slider from "rc-slider";
import Thumbnail from "components/thumbnail";
import useAudioPlayer from "hooks/useAudioPlayer";
import useQueueNavigation from "hooks/useQueueNavigation";
import { memo, useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { durationTrackFormat } from "utils/format.js";

import {
  mdiSkipNext,
  mdiPlaylistMusic,
  mdiPlayCircle,
  mdiSkipPrevious,
  mdiPauseCircle,
  mdiRepeat,
  mdiVolumeHigh,
  mdiLoading,
  mdiRepeatOnce,
  mdiVolumeMute,
} from "@mdi/js";

import "rc-slider/assets/index.css";

const defaultDurationFormat = "0:00";

const TrackInfo = memo(({ currentTrack }) => {
  return (
    <div className={"track-info"}>
      {currentTrack && (
        <>
          <div className={"track-info__thumbnail"}>
            <Thumbnail
              src={currentTrack.thumbnail_url}
              className={"thumbnail--tiny"}
            />
          </div>
          <div className={"track-info__metadata"}>
            <div className={"track-info__metadata__title"}>
              {currentTrack.title}
            </div>
            <div className={"track-info__metadata__channel"}>
              {currentTrack.publisher_title}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

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

const QueueToggler = (props) => {
  const path = "/queue";
  const match = useRouteMatch({ path });
  const history = useHistory();

  const toggle = () => {
    if (match) {
      history.goBack();
    } else {
      history.push(path);
    }
  };

  return (
    <Button
      icon={mdiPlaylistMusic}
      active={match}
      onClick={toggle}
      {...props}
    />
  );
};

function Player() {
  const {
    audioRef,
    seek,
    muted,
    togglePlay,
    toggleMuted,
    playing,
    loop,
    toggleLoop,
    ready,
    source,
    loading,
    duration,
    currentTime,
    currentTrack,
  } = useAudioPlayer();

  const { playPrev, playNext, canPrev, canNext } = useQueueNavigation(loop);

  return (
    <div className={"player"}>
      <audio ref={audioRef} type="audio/wav" src={source} />
      <TrackInfo currentTrack={currentTrack} />
      <div className="player__controls">
        <div className={"player__controls__buttons"}>
          <Button
            icon={mdiSkipPrevious}
            type="player-control"
            disabled={!canPrev}
            onClick={playPrev}
          />
          <Button
            icon={
              loading ? mdiLoading : playing ? mdiPauseCircle : mdiPlayCircle
            }
            type="player-control-main"
            iconClassName={loading && "animated--spin"}
            disabled={loading || !ready}
            onClick={togglePlay}
          />
          <Button
            icon={mdiSkipNext}
            type="player-control"
            onClick={playNext}
            disabled={!canNext}
          />
        </div>

        <PlayerSilder
          seek={seek}
          currentTime={currentTime}
          duration={
            duration || (currentTrack && currentTrack.audio_duration) || 0
          }
        />

        <div className={"player__controls__buttons"}>
          <Button
            active={loop}
            icon={loop === "once" ? mdiRepeatOnce : mdiRepeat}
            type="player-control"
            onClick={toggleLoop}
          />
          <Button
            icon={muted ? mdiVolumeMute : mdiVolumeHigh}
            type="player-control"
            onClick={toggleMuted}
          />
          <QueueToggler type={"player-control player-control--alternative"} />
        </div>
      </div>
      <div className={"playlist-info"}>
        <QueueToggler label={"Queue"} type={"large"} />
        {/* <Button icon={mdiDotsHorizontal} type={"icon-large"} /> */}
      </div>
    </div>
  );
}

export default Player;
