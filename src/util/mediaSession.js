import { getThumbnailCdnUrl } from "util/lbry";

const DEFAULT_ARTWORK_TYPE = "image/jpg";
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
  constructor() {
    if ("mediaSession" in navigator) {
      this.session = navigator.mediaSession;
    }
  }

  updateMediaMetadata(currentTrack) {
    console.info(this.session, currentTrack);
    if (this.session) {
      navigator.mediaSession.metadata = new window.MediaMetadata(
        getMediaMetadata(currentTrack)
      );
    }
  }

  updatePlaybackState(state = "paused") {
    console.info(state);
    if (this.session && "playbackState" in this.session) {
      navigator.mediaSession.playbackState = state;
    }
  }

  /* Position state (supported since Chrome 81) */
  updatePositionState(duration, currentTime, playbackRate) {
    if (this.session && "setPositionState" in this.session) {
      navigator.mediaSession.setPositionState({
        duration: duration || 0,
        playbackRate: playbackRate || 1.0,
        position: currentTime || 0,
      });
    }
  }

  registerMediaActions(actions) {
    if (this.session && "setActionHandler" in this.session) {
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
    if (this.session && "setActionHandler" in this.session) {
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
