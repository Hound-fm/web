import { createState } from "@hookstate/core";

const defaultAppState = {
  theme: "dark",
  searchQuery: null,
};

export const appState = createState(defaultAppState);

const defaultPlayerState = {
  currentTrack: null,
  playbackState: "paused",
  playbackStateSync: "",
};

export const globalPlayerState = createState(defaultPlayerState);
