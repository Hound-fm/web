import clsx from "clsx";
import {
  Volume1,
  VolumeX,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Layers,
} from "lucide-react";

import Slider from "component/slider";

import { useState, useEffect } from "react";
import { PlayCircle, PauseCircle } from "component/customIcons";
import Icon from "component/icon";
import Button from "component/button";
import Thumbnail from "component/thumbnail";
import { useMediaQuery } from "react-responsive";
import { globalPlayerState } from "store";
import useAudioPlayer from "hooks/useAudioPlayer";
import { getDurationTrackFormat } from "util/formatDuration";
import { useDebounceCallback } from "hooks/useDebounce";
import { useState as useHookState, Downgraded } from "@hookstate/core";

function StreamInfo() {
  const playerState = useHookState(globalPlayerState);
  const metadata = playerState.currentTrack.value || {};
  return (
    <div className="stream-info">
      <Thumbnail className="stream-info__thumbnail" src={metadata.thumbnail} />
      <div className="stream-info__text">
        <div className="stream-info__title text-overflow">{metadata.title}</div>
        <div className="stream-info__subtitle text-overflow">
          {metadata.channel_title}
        </div>
      </div>
    </div>
  );
}

function MiniPlayer() {
  return (
    <div className="player player--mini">
      <StreamInfo />
      <div className="player__actions">
        <Button
          icon={PlayCircle}
          className={"player__main-action button--player-action"}
        />
      </div>
    </div>
  );
}

function VolumeSlider({ updateVolume, volume, muted }) {
  const onUpdate = (update) => {
    updateVolume(update[0]);
  };

  return <Slider values={[volume]} onUpdate={onUpdate} />;
}

function TrackSlider({ currentTime, duration, seek, disabled }) {
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
}

export default function Player() {
  const {
    ready,
    duration,
    currentTime,
    player,
    togglePlay,
    seek,
    muted,
    volume,
    updateVolume,
    toggleMuted,
  } = useAudioPlayer();

  const playerState = useHookState(globalPlayerState);
  const playbackState = playerState.playbackState.attach(Downgraded).value;

  const showMiniPlayer = useMediaQuery({
    query: "(max-width: 900px)",
  });

  if (showMiniPlayer) {
    return <MiniPlayer />;
  }

  let playIcon = PlayCircle;
  if (playbackState === "playing") {
    playIcon = PauseCircle;
  }
  if (playbackState === "paused") {
    playIcon = PlayCircle;
  }

  let volumeIcon = muted ? VolumeX : Volume1;

  return (
    <div className="player">
      <StreamInfo />
      <div className="player__main-controls">
        <div className="player__actions">
          <Button icon={Shuffle} className={"button--player-action"} />
          <Button icon={SkipBack} className={"button--player-action"} />
          <Button
            icon={playIcon}
            onClick={togglePlay}
            className={"player__main-action button--player-action"}
          />
          <Button icon={SkipForward} className={"button--player-action"} />
          <Button icon={Repeat} className={"button--player-action"} />
        </div>
        <TrackSlider
          disabled={!ready || !duration}
          currentTime={currentTime}
          duration={duration}
          seek={seek}
        />
      </div>

      <div className="player__controls player__actions">
        <Button
          icon={Layers}
          className={"button--text button--player-action"}
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
