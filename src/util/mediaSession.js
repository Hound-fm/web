import { getThumbnailCdnUrl } from "util/lbry";

const DEFAULT_ARTWORK_TYPE = "image/png";
const DEFAULT_ARTWORK_SIZES = "256X256";

const getArtworkFromSrc = (thumbnail) => ({
  src: getThumbnailCdnUrl({ thumbnail }),
  type: DEFAULT_ARTWORK_TYPE,
  sizes: DEFAULT_ARTWORK_SIZES,
});

const getMediaMetadata = (currentTrack) => {
  const { title, channel_title, thumbnail } = currentTrack;
  const artwork = thumbnail ? [getArtworkFromSrc(thumbnail)] : [];
  return { title, artist: channel_title, artwork };
};

class MediaSessionProvider {
  updateMediaMetadata(currentTrack) {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata(
        getMediaMetadata(currentTrack)
      );
    }
  }

  updatePlaybackState(state = "paused") {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playerState = state;
    }
  }

  /* Position state (supported since Chrome 81) */
  updatePositionState(duration, currentTime, playbackRate) {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setPositionState({
        duration: duration || 0,
        playbackRate: 1,
        position: currentTime || 0,
      });
    }
  }

  registerMediaActions(actions) {
    if ("mediaSession" in navigator) {
      for (let [action, handler] of actions) {
        try {
          navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
          console.log(`The media session action, ${action}, is not supported`);
        }
      }
    }
  }

  unregisterMediaActions() {
    if ("mediaSession" in navigator) {
      const actions = ["play", "pause", "nexttrack", "previoustrack"];
      for (let action in actions) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch (error) {
          console.log(`The media session action, ${action}, is not supported`);
        }
      }
    }
  }
}

export default new MediaSessionProvider();
