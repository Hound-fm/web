import { useState, useEffect } from "react";
import { useQueueState, useQueueDispatch } from "store/queueContext";

function useQueueNavigation() {
  const { currentIndex, queue } = useQueueState();
  const queueDispatch = useQueueDispatch();
  const [state, setState] = useState({ canPrev: false, canNext: false });

  const playNext = () => {
    queueDispatch({ type: "setNextTrack" });
  };

  const playPrev = () => {
    queueDispatch({ type: "setPrevTrack" });
  };

  useEffect(() => {
    if (queue && queue.length > 1) {
      const canPrev = currentIndex > 0;
      const canNext = currentIndex < queue.length - 1;
      setState({ canPrev, canNext });
    } else {
      setState({ canPrev: false, canNext: false });
    }
  }, [currentIndex, queue]);

  useEffect(() => {
    if (queue && queue.length > 0) {
      const canPrev = currentIndex > 0;
      const canNext = currentIndex < queue.length - 1;
      setState({ canPrev, canNext });
    } else {
      setState({ canPrev: false, canNext: false });
    }
  }, [currentIndex, queue]);

  return { playNext, playPrev, ...state };
}

export default useQueueNavigation;
