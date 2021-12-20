import { useRef, useState, useEffect, useCallback } from "react";
import { getStreamLink } from "util/lbry";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { useQueueNavigation } from "hooks/useQueue";
import { globalPlayerState, globalPlaybackState } from "store";

import appMediaSession from "util/mediaSession";

const defaultState = {
  ready: false,
  ended: false,
  duration: 0,
};

const cachedState = {
  muted: false,
  volume: 0.5,
  lastVolume: 0.5,
  firstPlay: true,
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
  const [currentTime, setCurrentTime] = useState(0);

  const players = useRef({
    player: new Audio(),
    ghostPlayer: new Audio(),
  });

  const { queueNext, queuePrev } = useQueueNavigation();
  const playerState = useHookState(globalPlayerState);
  const loop = playerState.loop.value;
  const loopState = playerState.loop.attach(Downgraded).value;
  const hidden = playerState.hidden.attach(Downgraded).value;
  const playbackState = useHookState(globalPlaybackState);
  const currentTrack = playerState.currentTrack.attach(Downgraded).value;
  const playback = playbackState.playback.attach(Downgraded).value;
  const playbackSync = playbackState.playbackSync.attach(Downgraded).value;

  const [state, setState] = useState({ ...defaultState, ...cachedState });

  const handleErrors = useCallback(
    (e) => {
      const error = e.target ? e.target.error : e;
      const NETWORK_ABORT_ERROR = 20;
      // Audio playback failed - show a message saying why
      switch (error.code) {
        case NETWORK_ABORT_ERROR:
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
      playbackState.playback.set("paused");
    },
    // eslint-disable-next-line
    [setState]
  );

  const seek = (nextTime) => {
    // Seek to new time
    setCurrentTime(nextTime);
    players.current.player.currentTime = nextTime;
  };

  const updateVolume = (nextVolume) => {
    // Update new volume
    players.current.player.volume = nextVolume;
    players.current.ghostPlayer.volume = nextVolume;
  };

  const toggleLoop = () => {
    playerState.loop.set((prev) => {
      // Loop current playlist
      if (!prev) {
        return "playlist";
      }
      // Loop current track
      else if (prev === "playlist") {
        return "once";
      }
      // No loop
      else if (prev === "once") {
        return false;
      }
      return prev;
    });
  };

  const toggleMuted = () => {
    if (!players.current.player.muted) {
      players.current.player.volume = 0;
      players.current.ghostPlayer.volume = 0;
    } else {
      players.current.player.volume = state.lastVolume || 0.5;
      players.current.ghostPlayer.volume = state.lastVolume || 0.5;
    }
  };

  const triggerPlay = useCallback(() => {
    players.current.player
      .play()
      .then(() => {
        setState((prevState) => ({ ...prevState, ready: true }));
      })
      .catch((e) => {
        players.current.player.pause();
        handleErrors(e);
      });
  }, [setState, handleErrors]);

  const handleReady = useCallback(() => {
    setState((prevState) => {
      if (prevState.firstPlay) {
        return { ...prevState, firstPlay: false };
      }
      triggerPlay();
      return prevState;
    });
  }, [triggerPlay, setState]);

  const handleDurationChange = () => {
    const player = players.current.player;
    setCurrentTime(player.currentTime);
    appMediaSession.updatePositionState(
      player.duration,
      player.currentTime,
      player.playbackRate
    );
  };

  const handleVolumeChange = () => {
    setState((prevState) => ({
      ...prevState,
      volume: players.current.player.volume,
    }));

    if (players.current.player.volume) {
      setState((prevState) => ({
        ...prevState,
        lastVolume: players.current.player.volume,
      }));
    }

    if (!players.current.player.muted && players.current.player.volume === 0) {
      players.current.player.muted = true;
      players.current.ghostPlayer.muted = true;
      setState((prevState) => ({
        ...prevState,
        muted: true,
      }));
    } else if (
      players.current.player.muted &&
      players.current.player.volume > 0
    ) {
      players.current.player.muted = false;
      players.current.ghostPlayer.muted = false;
      setState((prevState) => ({
        ...prevState,
        muted: false,
      }));
    }
  };

  const handlePlaying = () => {
    const player = players.current.player;
    if (player.networkState === player.NETWORK_IDLE) {
      playbackState.playback.set("playing");
      playbackState.playbackSync.set("");
      setState((prevState) => ({
        ...prevState,
        ready: true,
        fisrtPlay: false,
      }));

      setCurrentTime(player.currentTime);
      appMediaSession.updatePositionState(
        player.duration,
        player.currentTime,
        player.playbackRate
      );
    }
  };

  const handleTimeUpdate = () => {
    const player = players.current.player;

    if (playbackState.playback.value === "paused" && !player.paused) {
      playbackState.playback.set("playing");
      playbackState.playbackSync.set("");
      appMediaSession.updatePositionState(
        player.duration,
        player.currentTime,
        player.playbackRate
      );
    }
    setCurrentTime(player.currentTime);
  };

  const handlePause = () => {
    playbackState.playback.set("paused");
    playbackState.playbackSync.set("");
  };

  const handleEnded = useCallback(() => {
    playbackState.playback.set("paused");
    setState((prevState) => ({ ...prevState, ended: true }));
    queueNext();
    // eslint-disable-next-line
  }, [setState]);

  const togglePlay = () => {
    if (isPlaying(players.current.player)) {
      players.current.player.pause();
    } else {
      triggerPlay();
    }
  };

  const updateMediaSession = useCallback(
    (track) => {
      appMediaSession.updateMediaMetadata(track);
      appMediaSession.registerMediaActions([
        [
          "play",
          () => {
            triggerPlay();
          },
        ],
        [
          "pause",
          () => {
            players.current.player.pause();
          },
        ],
        [
          "nexttrack",
          () => {
            queueNext();
          },
        ],
        [
          "previoustrack",
          () => {
            queuePrev();
          },
        ],
        [
          "seekbackward",
          (details) => {
            const player = players.current.player;
            const skipTime = details.seekOffset || 20;
            // User clicked "Seek Backward" media notification icon.
            seek(Math.max(player.currentTime - skipTime, 0));
            appMediaSession.updatePositionState(
              player.duration,
              player.currentTime,
              player.playbackRate
            );
          },
        ],
        [
          "seekforward",
          (details) => {
            const player = players.current.player;
            const skipTime = details.seekOffset || 20;
            // User clicked "Seek Backward" media notification icon.
            seek(
              Math.min(
                player.currentTime + skipTime,
                player.duration || state.duration || 0
              )
            );
            appMediaSession.updatePositionState(
              player.duration,
              player.currentTime,
              player.playbackRate
            );
          },
        ],
        [
          "seekto",
          (details) => {
            const player = players.current.player;
            if (details.fastSeek && "fastSeek" in player) {
              // Only use fast seek if supported.
              player.fastSeek(details.seekTime);
            } else {
              seek(details.seekTime);
            }
            appMediaSession.updatePositionState(
              player.duration,
              player.currentTime,
              player.playbackRate
            );
          },
        ],
      ]);
    },
    [queueNext, queuePrev, triggerPlay, state.duration]
  );

  const loadTrack = (source) => {
    // Swap audio players
    const { player, ghostPlayer } = players.current;
    players.current.player = ghostPlayer;
    players.current.ghostPlayer = player;
    // Stop previous player
    players.current.ghostPlayer.pause();
    // Swap events
    players.current.ghostPlayer.oncanplay = null;
    players.current.ghostPlayer.onvolumechange = null;
    players.current.ghostPlayer.onpause = null;
    players.current.ghostPlayer.onplaying = null;
    players.current.ghostPlayer.ondurationchange = null;
    players.current.ghostPlayer.ontimeupdate = null;
    players.current.ghostPlayer.onerror = null;
    players.current.ghostPlayer.onended = null;
    //...
    players.current.player.oncanplay = handleReady;
    players.current.player.onvolumechange = handleVolumeChange;
    players.current.player.onpause = handlePause;
    players.current.player.onplaying = handlePlaying;
    players.current.player.ondurationchange = handleDurationChange;
    players.current.player.ontimeupdate = handleTimeUpdate;
    players.current.player.onerror = handleErrors;
    players.current.player.onended = handleEnded;
    // Keep previous volume
    players.current.player.volume = ghostPlayer.volume;
    // Reset position
    players.current.player.currentTime = 0;
    appMediaSession.resetPositionState();
    // Load new track
    players.current.player.src = source;
    players.current.player.load();
  };

  // Player Initialization
  useEffect(() => {
    // GhostPlayer
    const { player, ghostPlayer } = players.current;
    ghostPlayer.volume = state.lastVolume;

    // Initialize player
    player.volume = state.lastVolume || 0.5;
    player.onpause = handlePause;
    player.onplaying = handlePlaying;
    player.onvolumechange = handleVolumeChange;
    player.ondurationchange = handleDurationChange;
    player.ontimeupdate = handleTimeUpdate;
    player.onerror = handleErrors;
    player.onended = handleEnded;

    // Destructor
    return () => {
      // eslint-disable-next-line
      const { player, ghostPlayer } = players.current;
      // Main player
      player.oncanplay = null;
      player.onpause = null;
      player.onplaying = null;
      player.onvolumechange = null;
      player.ondurationchange = null;
      player.ontimeupdate = null;
      player.onended = null;
      player.onerror = null;
      // Ghost player
      ghostPlayer.oncanplay = null;
      ghostPlayer.onpause = null;
      ghostPlayer.onplaying = null;
      ghostPlayer.onvolumechange = null;
      ghostPlayer.ondurationchange = null;
      ghostPlayer.ontimeupdate = null;
      ghostPlayer.onended = null;
      ghostPlayer.onerror = null;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (players.current.player) {
      players.current.player.loop = loopState === "once";
      players.current.ghostPlayer.loop = loopState === "once";
    }
  }, [loopState]);

  useEffect(() => {
    if (currentTrack) {
      updateMediaSession(currentTrack);
      const { id, name, duration, fee_amount } = currentTrack;
      // Reload player
      if (!fee_amount) {
        const source = getStreamLink({ id, name });
        loadTrack(source);
      } else {
        // Pause player and skip paid track
        players.current.player.pause();
        appMediaSession.updatePlaybackState("paused");
        // Todo: Skip track and provide UI feedback to user
      }

      // Reset state with default values
      setState((prevState) => ({
        ...prevState,
        ...defaultState,
        duration,
      }));

      setCurrentTime(0);
    }
    // eslint-disable-next-line
  }, [currentTrack, setState, setCurrentTime]);

  // Player visibility detection
  useEffect(() => {
    if (currentTrack && hidden) {
      playerState.hidden.set(false);
    } else if (!currentTrack && !hidden) {
      playerState.hidden.set(true);
    }
    // eslint-disable-next-line
  }, [currentTrack, hidden]);

  useEffect(() => {
    if (playbackSync === "playing") {
      triggerPlay();
    } else if (playbackSync === "paused") {
      players.current.player.pause();
    }
  }, [playbackSync, triggerPlay]);

  useEffect(() => {
    if (currentTrack && currentTrack.id) {
      if (playback === "playing") {
        // Set current track as page
        document.title = `${currentTrack.title} - ${currentTrack.channel_title}`;
        // Update mediaSession playback
      } else if (playback === "paused") {
        // TODO: Use previous document title
        document.title = "hound.fm";
      }
    }
  }, [playback, currentTrack]);

  return {
    loop,
    seek,
    currentTime,
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
