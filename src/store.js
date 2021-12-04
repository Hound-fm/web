import { createState } from "@hookstate/core";
import { Persistence } from "@hookstate/persistence";

const defaultAppState = {
  theme: "dark",
  searchQuery: null,
  favorites: {
    artist: [],
    music_recording: [],
    podcast_series: [],
    podcast_episode: [],
  },
};

export const globalAppState = createState(defaultAppState);
// Persistence for currentTrack (Last track played)
globalAppState.attach(Persistence("hound-local-store-favorites"));

const defaultMobileAppState = {
  menuExpanded: false,
};

export const globalMobileAppState = createState(defaultMobileAppState);

const defaultPlayerState = {
  // Playback state
  currentTrack: null,
  // Queue state
  queueData: [],
  queueTitle: "",
  queueIndex: 0,
};
export const globalPlayerState = createState(defaultPlayerState);
// Persistence for currentTrack (Last track played)
globalPlayerState.currentTrack.attach(Persistence("hound-local-store-track"));

const defaultPlaybackState = {
  playback: "paused",
  playbackSync: "",
};

export const globalPlaybackState = createState(defaultPlaybackState);
