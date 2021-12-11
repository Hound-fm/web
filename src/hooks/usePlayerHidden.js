import { useEffect } from "react";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { globalPlayerState } from "store";

export default function usePlayerHidden() {
  const playerState = useHookState(globalPlayerState);
  const hidden = playerState.hidden.attach(Downgraded).value;
  useEffect(() => {
    if (hidden) {
      document.documentElement.dataset.playerHidden = true;
    } else {
      document.documentElement.dataset.playerHidden = false;
    }
  }, [hidden]);
  return hidden;
}
