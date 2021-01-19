import { useState, useEffect } from "react";
import { useQueueState, useQueueDispatch } from "store/queueContext";

function useQueueNavigation(loop) {
  const { currentIndex, queue } = useQueueState();
  const queueDispatch = useQueueDispatch();
  const [state, setState] = useState({ canPrev: false, canNext: false });

  const playNext = () => {
    if (currentIndex < queue.length) {
      queueDispatch({ type: "setNextTrack" });
    } else if (loop) {
      queueDispatch({ type: "setTrack", data: 0 });
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      queueDispatch({ type: "setPrevTrack" });
    } else if (loop) {
      queueDispatch({ type: "setTrack", data: queue.length - 1 });
    }
  };

  useEffect(() => {
    if (queue && queue.length > 1) {
      const canPrev = loop === "playlist" || currentIndex > 0;
      const canNext = loop === "playlist" || currentIndex < queue.length - 1;
      setState({ canPrev, canNext });
    } else {
      setState({ canPrev: false, canNext: false });
    }
  }, [currentIndex, queue, loop]);

  return { playNext, playPrev, ...state };
}

export default useQueueNavigation;
