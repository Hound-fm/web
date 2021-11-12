import { useRef, useState, useEffect } from "react";
import { getStreamLink } from "util/lbry";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { globalPlayerState } from "store";

import {
  updateMediaMetadata,
  updatePlaybackState,
  updatePositionState,
  registerMediaActions,
} from "util/mediaSession";

const defaultState = {
  loop: false,
  ready: false,
  duration: 0,
  currentTime: 0,
};

const cachedState = {
  muted: false,
  volume: 0.5,
  lastVolume: 0.5,
};

const isPlaying = (audio) => {
  return (
    audio &&
    audio.currentTime > 0 &&
    !audio.paused &&
    !audio.ended &&
    audio.readyState > 2
  );
};

const useAudioPlayer = () => {
  const player = useRef(new Audio());
  const playerState = useHookState(globalPlayerState);
  const currentTrack = playerState.currentTrack.attach(Downgraded).value;
  const playbackState = playerState.playbackState.attach(Downgraded).value;
  const playbackStateSync =
    playerState.playbackStateSync.attach(Downgraded).value;

  const [state, setState] = useState({ ...defaultState, ...cachedState });

  const seek = (nextTime) => {
    // Force UI update
    setState((prevState) => ({ ...prevState, currentTime: nextTime }));
    // Seek to new time
    player.current.currentTime = nextTime;
  };

  const updateVolume = (nextVolume) => {
    // Update new volume
    player.current.volume = nextVolume;
  };

  const toggleLoop = () => {
    // Loop current playlist
    if (!state.loop) {
      setState((prevState) => ({ ...prevState, loop: "playlist" }));
    }
    // Loop current track
    if (state.loop === "playlist") {
      setState((prevState) => ({ ...prevState, loop: "once" }));
    }
    // No loop
    if (state.loop === "once") {
      setState((prevState) => ({ ...prevState, loop: "false" }));
    }
  };

  const toggleMuted = () => {
    if (!player.current.muted) {
      player.current.volume = 0;
    } else {
      player.current.volume = state.lastVolume || 0.5;
    }
  };

  const triggerPlay = () => {
    const promise = player.current.play();
    if (promise) {
      promise
        .then(() => {})
        .catch((e) => {
          console.error(e);
          player.current.pause();
        });
    }
  };

  const handleReady = () => {
    setState((prevState) => ({ ...prevState, ready: true }));
    console.info(
      "ready",
      player.current.readyState,
      player.current.networkState
    );
    triggerPlay();
  };

  const handleDurationChange = () => {
    if (player.current) {
      setState((prevState) => ({
        ...prevState,
        duration: player.current.duration,
      }));
      updatePositionState(player.current);
    }
  };

  const handleVolumeChange = () => {
    if (player.current) {
      setState((prevState) => ({
        ...prevState,
        volume: player.current.volume,
      }));

      if (player.current.volume) {
        setState((prevState) => ({
          ...prevState,
          lastVolume: player.current.volume,
        }));
      }
    }

    if (!player.current.muted && player.current.volume === 0) {
      player.current.muted = true;
      setState((prevState) => ({
        ...prevState,
        muted: true,
      }));
    } else if (player.current.muted && player.current.volume > 0) {
      player.current.muted = false;
      setState((prevState) => ({
        ...prevState,
        muted: false,
      }));
    }
  };

  const handlePlaying = () => {
    if (player.current.networkState == player.current.NETWORK_IDLE) {
      playerState.playbackState.set("playing");
      playerState.playbackStateSync.set("");
    }
  };

  const handleWaiting = () => {
    // ...
  };

  const handleTimeUpdate = () => {
    setState((prevState) => ({
      ...prevState,
      currentTime: player.current.currentTime,
    }));

    if (playerState.playbackState.value === "paused") {
      playerState.playbackStateSync.set("");
      playerState.playbackState.set("playing");
    }

    updatePositionState(player.current);
  };

  const handlePause = () => {
    playerState.playbackStateSync.set("");
    playerState.playbackState.set("paused");
  };

  const handleEnded = () => {
    if (state.loop === "playlist") {
      // queueDispatch({ type: "setNextTrack" });
    }
    playerState.playbackState.set("paused");
  };

  const togglePlay = () => {
    if (isPlaying(player.current)) {
      player.current.pause();
    } else {
      triggerPlay();
    }
  };

  const handleErrors = (e) => {
    const error = e.target.error;
    // Audio playback failed - show a message saying why
    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        console.error("You aborted the video playback.");
        break;
      case error.MEDIA_ERR_NETWORK:
        console.error("A network error caused the audio download to fail.");
        break;
      case error.MEDIA_ERR_DECODE:
        console.error(
          "The audio playback was aborted due to a corruption problem or because the video used features your browser did not support."
        );
        break;
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        console.error(
          "The video audio not be loaded, either because the server or network failed or because the format is not supported."
        );
        break;
      default:
        console.error("An unknown error occurred.");
        break;
    }
    setState((prevState) => ({
      ...prevState,
      ready: false,
      error: true,
    }));
    playerState.playbackState.set("paused");
  };

  useEffect(() => {
    // Register audio player events
    player.current.addEventListener("error", handleErrors);
    player.current.addEventListener("canplaythrough", handleReady);
    player.current.addEventListener("pause", handlePause);
    player.current.addEventListener("playing", handlePlaying);
    player.current.addEventListener("waiting", handleWaiting);
    player.current.addEventListener("volumechange", handleVolumeChange);
    player.current.addEventListener("durationchange", handleDurationChange);
    player.current.addEventListener("timeupdate", handleTimeUpdate);
    player.current.addEventListener("ended", handleEnded);

    /* Seek To (supported since Chrome 78) */
    const seekHandler = [
      "seekto",
      (event) => {
        if (event.fastSeek && "fastSeek" in player.current) {
          return player.current.fastSeek(event.seekTime);
        }
        player.current.currentTime = event.seekTime;
      },
    ];

    // Register mediaSession actions
    const actions = [
      seekHandler,
      ["play", () => triggerPlay()],
      ["pause", () => player.current.pause()],
      // ["nexttrack", () => queueDispatch({ type: "setNextTrack" })],
      // ["previoustrack", () => queueDispatch({ type: "setPrevTrack" })],
    ];

    registerMediaActions(actions);

    // Unmount
    return () => {
      player.current.pause();
      player.current.removeEventListener("error", handleErrors);
      player.current.removeEventListener("canplaythrough", handleReady);
      player.current.removeEventListener("pause", handlePause);
      player.current.removeEventListener("playing", handlePlaying);
      player.current.removeEventListener("waiting", handleWaiting);
      player.current.removeEventListener("timeupdate", handleTimeUpdate);
      player.current.removeEventListener("volumechange", handleVolumeChange);
      player.current.removeEventListener(
        "durationchange",
        handleDurationChange
      );
      player.current.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (player.current) {
      player.current.loop = state.loop === "once";
    }
  }, [state.loop]);

  useEffect(() => {
    if (currentTrack) {
      const { id, name, duration } = currentTrack;
      const source = getStreamLink({ id, name });

      // Reload player
      player.current.pause();
      player.current.currentTime = 0;
      player.current.src = source;

      // Reset state with default values
      setState((prevState) => ({
        ...prevState,
        ...defaultState,
        ready: false,
        duration,
      }));

      updateMediaMetadata(currentTrack);
    }
  }, [currentTrack, setState]);

  useEffect(() => {
    if (playbackStateSync === "playing") {
      triggerPlay();
    } else if (playbackStateSync === "paused") {
      player.current.pause();
    }
  }, [playbackStateSync]);

  return {
    seek,
    player,
    togglePlay,
    toggleMuted,
    toggleLoop,
    updateVolume,
    ...state,
  };
};

export default useAudioPlayer;
