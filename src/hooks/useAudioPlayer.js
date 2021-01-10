import { useRef, useState, useEffect } from "react";
import { getStreamLink } from "utils/lbryplayer";
import { usePlayerState } from "store/playerContext";
import { durationTrackFormat } from "utils/format.js";

const isPlaying = (audio) => {
  return (
    audio &&
    audio.currentTime > 0 &&
    !audio.paused &&
    !audio.ended &&
    audio.readyState > 2
  );
};

const defaultState = {
  ready: false,
  source: null,
  loading: false,
  duration: 0,
  currentTime: 0,
  durationFormated: durationTrackFormat(0),
  loop: false,
  paused: false,
  playing: false,
};

const useAudioPlayer = () => {
  const audioRef = useRef();
  const { name, id } = usePlayerState();

  const [state, setState] = useState(defaultState);

  const seek = (nextTime) => {
    const player = audioRef.current;
    // Force UI update
    setState((prevState) => ({ ...prevState, currentTime: nextTime }));
    // Seek to new time
    player.currentTime = nextTime;
  };

  const toggleLoop = () => {
    const player = audioRef.current;

    // Loop current playlist
    if (!state.loop) {
      setState((prevState) => ({ ...prevState, loop: "playlist" }));
      player.loop = false;
    }

    // Loop current track
    if (state.loop == "playlist") {
      setState((prevState) => ({ ...prevState, loop: "once" }));
      player.loop = true;
    }

    // No loop
    if (state.loop === "once") {
      setState((prevState) => ({ ...prevState, loop: false }));
      player.loop = false;
    }
  };

  const triggerPlay = () => {
    const player = audioRef.current;
    const promise = player.play();
    if (promise) {
      promise
        .then(() => {})
        .catch(() => {
          setState((prevState) => ({ paused: player.paused }));
        });
    }
  };

  const triggerPause = () => {
    const player = audioRef.current;
    player.pause();
    setState((prevState) => ({
      ...prevState,
      paused: player.paused,
      playing: false,
    }));
  };

  const handleReady = () => {
    setState((prevState) => ({ ...prevState, loading: false, ready: true }));
  };

  const handleMetadata = () => {
    const player = audioRef.current;
    setState((prevState) => ({
      ...prevState,
      duration: player.duration,
      durationFormated: durationTrackFormat(player.duration),
    }));
  };

  const handlePlaying = () => {
    const player = audioRef.current;
    setState((prevState) => ({
      ...prevState,
      paused: false,
      playing: true,
      loading: false,
    }));
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
  };

  const handleEnded = () => {
    const player = audioRef.current;
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
    if (id && name) {
      const source = getStreamLink({ id, name });
      // Reset state with default values
      setState({
        ...defaultState,
        loading: true,
        ready: false,
        source,
      });
    }
  }, [id, name, setState]);

  useEffect(() => {
    const player = audioRef.current;
    player.addEventListener("error", handleErrors);
    player.addEventListener("canplay", handleReady);
    player.addEventListener("playing", handlePlaying);
    player.addEventListener("waiting", handleWaiting);
    player.addEventListener("loadedmetadata", handleMetadata);
    player.addEventListener("timeupdate", handleTimeUpdate);
    player.addEventListener("ended", handleEnded);
    // Unmount
    return () => {
      const player = audioRef.current;
      player.removeEventListener("error", handleErrors);
      player.removeEventListener("canplay", handleReady);
      player.removeEventListener("playing", handlePlaying);
      player.removeEventListener("waiting", handleWaiting);
      player.removeEventListener("timeupdate", handleTimeUpdate);
      player.removeEventListener("loadedmetadata", handleMetadata);
      player.removeEventListener("ended", handleEnded);
    };
  }, []);

  return { audioRef, togglePlay, toggleLoop, seek, ...state };
};

export default useAudioPlayer;
