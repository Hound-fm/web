import { useRef, useState, useEffect } from "react";
import { useState as useHookState, Downgraded } from "@hookstate/core";

function useQueueNavigation() {
  const playerState = useHookState(globalPlayerState);
  // Use downgraded pluging to interact with array
  const queueData = playerState.queueData.attach(Downgraded).get();
  const queueTitle = playerState.queueTitle.value;
  const queueIndex = playerState.queueIndex.attach(Downgraded).get();
  const hasData = queueData && queueData.length;
  const nextDisabled = !hasData || queueIndex <= 0;
  const prevDisabled = !hasData || queueIndex >= queueData.length - 1;

  const queueNavigate = (step) => {
    const limit = queueData.length;
    const newIndex = queueIndex + step;
    if (newIndex < limit && newIndex > -1) {
      playerState.queueIndex.set(newIndex);
    }
  };

  // Next track on queue
  const queueNext = () => {
    queueNavigate(1);
  };

  // Previous track on queue
  const queuePrev = () => {
    queueNavigate(-1);
  };

  return { queuePrev, queueNext, nextDisabled, prevDisabled };
}
