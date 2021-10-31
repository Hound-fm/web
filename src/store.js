import { createState } from "@hookstate/core";

const defaultState = {
  theme: "dark",
  searchQuery: null,
};

export const globalState = createState(defaultState);
