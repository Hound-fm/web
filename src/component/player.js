import clsx from "clsx";
import {
  Volume1,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Layers,
} from "lucide-react";

import Link from "component/link";

import Slider from "component/slider";

import { useState, useEffect, memo } from "react";
import { PlayCircle, PauseCircle } from "component/customIcons";
import Button from "component/button";
import Thumbnail from "component/thumbnail";
import FavoriteButton from "component/favoriteButton";
import useAudioPlayer from "hooks/useAudioPlayer";
import { useMediaQuery } from "react-responsive";
import { globalPlayerState, globalPlaybackState } from "store";
import { useNavigate, useMatch } from "react-router-dom";
import { getDurationTrackFormat } from "util/formatDuration";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { WEB_DOMAIN } from "constants.js";

function StreamInfo() {
  let subLinkTo;
  const playerState = useHookState(globalPlayerState);
  const metadata = playerState.currentTrack.value || {};

  if (metadata) {
    if (metadata.channel_type === "artist") {
      subLinkTo = `/artist/${metadata.channel_id}`;
    } else if (metadata.channel_type === "podcast_series") {
      subLinkTo = `/podcast/${metadata.channel_id}`;
    }
  }

  const href = metadata && metadata.url && `${WEB_DOMAIN}/${metadata.url}`;
  return (
    <div className="stream-info">
      <Thumbnail className="stream-info__thumbnail" src={metadata.thumbnail} />
      <div className="stream-info__text">
        <Link
          className="stream-info__title text-overflow"
          href={href}
          target={href ? "_blank" : null}
        >
          {metadata.title}
        </Link>
        <Link className="stream-info__subtitle text-overflow" to={subLinkTo}>
          {metadata.channel_title}
        </Link>
      </div>
    </div>
  );
}

const MiniPlayer = memo(({ hidden, togglePlay, playIcon }) => {
  return (
    <div className="player player--mini" aria-hidden={hidden}>
      <StreamInfo />
      <div className="player__actions">
        <Button
          icon={playIcon}
          onClick={togglePlay}
          className={"player__main-action button--player-action"}
        />
      </div>
    </div>
  );
});

const VolumeSlider = memo(({ updateVolume, volume, muted }) => {
  const onUpdate = (update) => {
    updateVolume(update[0]);
  };

  return <Slider values={[volume]} onUpdate={onUpdate} />;
});

const TrackSlider = memo(({ currentTime, duration, seek, disabled }) => {
  const [state, setState] = useState({
    values: [currentTime || 0],
    update: [currentTime || 0],
  });

  const [userSeeking, setUserSeeking] = useState(false);

  const onUserChange = (userChange) => {
    setUserSeeking(userChange);
  };

  const onUpdate = (update) => {
    setState((prev) => ({ ...prev, update }));
  };

  const onChange = (values) => {
    if (values && values[0] >= 0) {
      if (userSeeking) {
        seek(values[0]);
      }
    }
  };

  useEffect(() => {
    if (!userSeeking) {
      setState((prev) => ({ ...prev, values: [currentTime] }));
    }
  }, [userSeeking, currentTime]);

  useEffect(() => {
    if (disabled) {
      setState((prev) => ({ ...prev, update: [0], values: [0] }));
    }
  }, [disabled]);

  return (
    <div className={clsx("slider player__slider", false && "slider--active")}>
      <span className={"label"}>
        {getDurationTrackFormat(state.update[0] || 0) || "0:00"}
      </span>
      <Slider
        disabled={disabled}
        step={1}
        range={[0, duration]}
        values={state.values}
        onChange={onChange}
        onUpdate={onUpdate}
        onUserChange={onUserChange}
      />
      <span className={"label"}>
        {getDurationTrackFormat(duration) || "0:00"}
      </span>
    </div>
  );
});

export default function Player() {
  const {
    loop,
    seek,
    ready,
    volume,
    duration,
    currentTime,
    muted,
    updateVolume,
    togglePlay,
    toggleLoop,
    toggleMuted,
    currentTrack,
    queuePrev,
    queueNext,
  } = useAudioPlayer();

  const navigate = useNavigate();

  let onQueuePage = useMatch({
    path: "/queue",
    exact: false,
  });

  const toggleQueue = () => {
    if (onQueuePage) {
      // Go back
      navigate(-1);
    } else {
      // Go to queue page
      navigate("/queue");
    }
  };

  const playbackState = useHookState(globalPlaybackState);
  const playback = playbackState.playback.attach(Downgraded).value;
  const hidden = currentTrack && currentTrack.id ? false : true;

  const showMiniPlayer = useMediaQuery({
    query: "(max-width: 900px)",
  });

  let playIcon = PlayCircle;
  if (playback === "playing") {
    playIcon = PauseCircle;
  }
  if (playback === "paused") {
    playIcon = PlayCircle;
  }

  let volumeIcon = muted ? VolumeX : Volume1;

  if (showMiniPlayer) {
    return (
      <MiniPlayer hidden={hidden} togglePlay={togglePlay} playIcon={playIcon} />
    );
  }

  return (
    <div className="player" aria-hidden={hidden}>
      <StreamInfo />
      <div className="player__main-controls">
        <div className="player__actions">
          <Button icon={Shuffle} className={"button--player-action"} />
          <Button
            icon={SkipBack}
            className={"button--player-action"}
            onClick={queuePrev}
          />
          <Button
            icon={playIcon}
            onClick={togglePlay}
            className={"player__main-action button--player-action"}
          />
          <Button
            icon={SkipForward}
            className={"button--player-action"}
            onClick={queueNext}
          />
          <Button
            aria-pressed={loop ? true : false}
            icon={loop === "once" ? Repeat1 : Repeat}
            className={"button--player-action"}
            onClick={toggleLoop}
          />
        </div>
        <TrackSlider
          disabled={!ready || !duration}
          currentTime={currentTime}
          duration={duration}
          seek={seek}
        />
      </div>

      <div className="player__controls player__actions">
        {currentTrack && (
          <FavoriteButton
            id={currentTrack.id}
            favoriteType={currentTrack.stream_type || currentTrack.channel_type}
            className={"button--text button--favorite button--player-action"}
          />
        )}
        <Button
          icon={Layers}
          onClick={toggleQueue}
          className={"button--text button--player-action"}
          aria-pressed={onQueuePage ? true : false}
        />
        <Button
          icon={volumeIcon}
          className={"button--player-action"}
          onClick={toggleMuted}
        />
        <VolumeSlider
          muted={muted}
          volume={volume}
          updateVolume={updateVolume}
        />
      </div>
    </div>
  );
}
