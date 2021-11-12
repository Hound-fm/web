import { createState } from "@hookstate/core";

const defaultAppState = {
  theme: "dark",
  searchQuery: null,
};

export const appState = createState(defaultAppState);

const defaultPlayerState = {
  // Playback state
  currentTrack: null,
  playbackState: "paused",
  playbackStateSync: "",
  // Queue state
  queueData: [],
  queueTitle: "",
  queueIndex: null,
};

export const globalPlayerState = createState(defaultPlayerState);
