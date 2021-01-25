import { getIntialState } from "utils/persist";

export const queueDefaultState = {
  queue: [],
  nextQueue: [],
  currentIndex: -1,
};

export const settingsDefaultState = getIntialState("hound-fm-settings") || {
  theme: "light",
};
