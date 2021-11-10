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

export const updateMediaMetadata = (currentTrack) => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new window.MediaMetadata(
      getMediaMetadata(currentTrack)
    );
  }
};

/* Position state (supported since Chrome 81) */
export const updatePositionState = (audio) => {
  if ("setPositionState" in navigator.mediaSession) {
    navigator.mediaSession.setPositionState({
      duration: audio.duration || 0,
      playbackRate: audio.playbackRate || 1.0,
      position: audio.currentTime || 0,
    });
  }
};

export const updatePlaybackState = (state) => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = state;
  }
};

export const registerMediaActions = (actions) => {
  if ("mediaSession" in navigator) {
    for (const [action, handler] of actions) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.log(`The media session action, ${action}, is not supported`);
      }
    }
  }
};
