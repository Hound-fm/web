import { useRef, useState, useEffect } from "react";
import { getStreamLink } from "util/lbry";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { useQueueNavigation } from "hooks/useQueue";
import { globalPlayerState } from "store";

import {
  updateMediaMetadata,
  updatePlaybackState,
  updatePositionState,
  registerMediaActions,
} from "util/mediaSession";

const defaultState = {
  ready: false,
  ended: false,
  duration: 0,
  currentTime: 0,
};

const cachedState = {
  loop: false,
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
  const { queueNext, queuePrev } = useQueueNavigation();
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
    setState((prevState) => {
      // Loop current playlist
      if (!prevState.loop) {
        return { ...prevState, loop: "playlist" };
      }
      // Loop current track
      else if (prevState.loop === "playlist") {
        return { ...prevState, loop: "once" };
      }
      // No loop
      else if (prevState.loop === "once") {
        return { ...prevState, loop: false };
      }
      return prevState;
    });
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
    playerState.playbackState.set("paused");
    setState((prevState) => ({ ...prevState, ended: true }));
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
      ["play", triggerPlay],
      ["pause", player.current.pause],
      ["nexttrack", queueNext],
      ["previoustrack", queuePrev],
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
  }, [state.loop, player.current]);

  useEffect(() => {
    if (state.ended && state.loop === "playlist") {
      queueNext();
    }
  }, [state.ended, state.loop]);

  useEffect(() => {
    if (currentTrack) {
      const { id, name, duration, title } = currentTrack;
      const source = getStreamLink({ id, name });

      // Reload player
      player.current.pause();
      player.current.currentTime = 0;
      player.current.src = source;

      // Reset state with default values
      setState((prevState) => ({
        ...prevState,
        ...defaultState,
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
  }, [playbackStateSync, player.current]);

  return {
    seek,
    player,
    togglePlay,
    toggleMuted,
    toggleLoop,
    updateVolume,
    currentTrack,
    queueNext,
    queuePrev,
    ...state,
  };
};

export default useAudioPlayer;
