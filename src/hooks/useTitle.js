import { useState as useHookState } from "@hookstate/core";
import { globalPageState } from "store";

const useTitle = () => {
  const appState = useHookState(globalPageState);
  const title = appState.title.value;
  const setTitle = (newTitle) => {
    appState.title.set(newTitle);
  };
  return { title, setTitle };
};

export default useTitle;
