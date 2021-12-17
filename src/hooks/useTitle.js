import { useState as useHookState } from "@hookstate/core";
import { globalAppState } from "store";

const useTitle = () => {
  const appState = useHookState(globalAppState);
  const title = appState.title.value;
  const setTitle = (newTitle) => {
    appState.title.set(newTitle);
  };
  return { title, setTitle };
};

export default useTitle;
