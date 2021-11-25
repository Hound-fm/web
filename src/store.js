import { createState } from "@hookstate/core";

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

const defaultPlayerState = {
  // Playback state
  currentTrack: null,
  playbackState: "paused",
  playbackStateSync: "",
  // Queue state
  queueData: [],
  queueTitle: "",
  queueIndex: -1,
};

export const globalPlayerState = createState(defaultPlayerState);
