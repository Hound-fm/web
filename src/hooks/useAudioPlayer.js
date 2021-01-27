import { useRef, useState, useEffect } from "react";
import { getStreamLink } from "utils/lbry";
import { useQueueDispatch, useQueueState } from "store/queueContext";
import {
  updateMediaMetadata,
  updatePlaybackState,
  updatePositionState,
  registerMediaActions,
} from "utils/mediaSession";
import useGetTrack from "hooks/useGetTrack";

const defaultPersistentState = {
  muted: false,
};

const defaultState = {
  ready: false,
  source: null,
  loading: false,
  duration: 0,
  currentTime: 0,
  paused: false,
  playing: false,
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
  const audioRef = useRef();
  const queueDispatch = useQueueDispatch();
  const { queue, nextQueue } = useQueueState();
  const { currentTrack } = useGetTrack();
  const [state, setState] = useState({
    ...defaultState,
    ...defaultPersistentState,
  });
  const stateRef = useRef(state);

  const updateState = (newState) => {
    setState((prevState) => {
      const updated = { ...prevState, ...newState };
      stateRef.current = updated;
      return updated;
    });
  };

  const seek = (nextTime) => {
    const player = audioRef.current;
    // Force UI update
    setState((prevState) => ({ ...prevState, currentTime: nextTime }));
    // Seek to new time
    player.currentTime = nextTime;
  };

  const toggleLoop = () => {
    // Loop current playlist
    if (!state.loop) {
      updateState({ loop: "playlist" });
    }

    // Loop current track
    if (state.loop === "playlist") {
      updateState({ loop: "once" });
    }

    // No loop
    if (state.loop === "once") {
      updateState({ loop: false });
    }
  };

  const toggleMuted = () => {
    const player = audioRef.current;
    player.muted = !player.muted;
    setState((prevState) => ({ ...prevState, muted: player.muted }));
  };

  const triggerPause = () => {
    const player = audioRef.current;
    player.pause();
  };

  const triggerPlay = () => {
    const player = audioRef.current;
    const promise = player.play();
    if (promise) {
      promise
        .then(() => {})
        .catch(() => {
          triggerPause();
        });
    }
  };

  const handleReady = () => {
    setState((prevState) => ({ ...prevState, loading: false, ready: true }));
    triggerPlay();
  };

  const handleDurationChange = () => {
    const player = audioRef.current;
    setState((prevState) => ({
      ...prevState,
      duration: player.duration,
    }));
    updatePositionState(player);
  };

  const handlePlaying = () => {
    setState((prevState) => ({
      ...prevState,
      paused: false,
      playing: true,
      loading: false,
    }));
    updatePlaybackState("playing");
  };

  const handleWaiting = () => {
    setState((prevState) => ({
      ...prevState,
      playing: false,
      paused: false,
      loading: true,
    }));
  };

  const handleTimeUpdate = () => {
    const player = audioRef.current;
    setState((prevState) => ({
      ...prevState,
      currentTime: player.currentTime,
    }));
    updatePositionState(player);
  };

  const handlePause = () => {
    updateState({ pause: true, playing: false });
    updatePlaybackState("paused");
  };

  const handleEnded = () => {
    if (stateRef.current.loop === "playlist") {
      queueDispatch({ type: "setNextTrack" });
    }

    setState((prevState) => ({ ...prevState, playing: false, pause: false }));
  };

  const togglePlay = () => {
    const player = audioRef.current;
    if (isPlaying(player)) {
      triggerPause();
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
      loading: false,
      ready: false,
      error: true,
    }));
  };

  useEffect(() => {
    if (currentTrack) {
      updateMediaMetadata(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (!currentTrack && nextQueue.length && !queue.length) {
      queueDispatch({ type: "loadNextQueue" });
      queueDispatch({ type: "setTrack", data: 0 });
    }
  }, [currentTrack, nextQueue, queue, queueDispatch]);

  useEffect(() => {
    const player = audioRef.current;
    if (player) {
      player.loop = state.loop === "once";
    }
  }, [state.loop]);

  useEffect(() => {
    if (currentTrack) {
      const { id, name } = currentTrack;
      const source = getStreamLink({ id, name });
      // Reset state with default values
      setState((prevState) => ({
        ...prevState,
        ...defaultState,
        loading: true,
        ready: false,
        source,
      }));
    }
  }, [currentTrack, setState]);

  useEffect(() => {
    const player = audioRef.current;
    // Register audio player events
    player.addEventListener("error", handleErrors);
    player.addEventListener("canplay", handleReady);
    player.addEventListener("pause", handlePause);
    player.addEventListener("playing", handlePlaying);
    player.addEventListener("waiting", handleWaiting);
    player.addEventListener("durationchange", handleDurationChange);
    player.addEventListener("timeupdate", handleTimeUpdate);
    player.addEventListener("ended", handleEnded);

    /* Seek To (supported since Chrome 78) */
    const seekHandler = [
      "seekto",
      (event) => {
        if (event.fastSeek && "fastSeek" in player) {
          return player.fastSeek(event.seekTime);
        }
        player.currentTime = event.seekTime;
      },
    ];

    // Register mediaSession actions
    const actions = [
      seekHandler,
      ["play", () => triggerPlay()],
      ["pause", () => triggerPause()],
      ["nexttrack", () => queueDispatch({ type: "setNextTrack" })],
      ["previoustrack", () => queueDispatch({ type: "setPrevTrack" })],
    ];

    registerMediaActions(actions);

    // Unmount
    return () => {
      player.removeEventListener("error", handleErrors);
      player.removeEventListener("canplay", handleReady);
      player.removeEventListener("pause", handlePause);
      player.removeEventListener("playing", handlePlaying);
      player.removeEventListener("waiting", handleWaiting);
      player.removeEventListener("timeupdate", handleTimeUpdate);
      player.removeEventListener("durationchange", handleDurationChange);
      player.removeEventListener("ended", handleEnded);
    };
  });

  return {
    audioRef,
    currentTrack,
    togglePlay,
    toggleMuted,
    toggleLoop,
    seek,
    ...state,
  };
};

export default useAudioPlayer;
