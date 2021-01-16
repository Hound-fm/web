import { useState, useEffect } from "react";
import { useQueueState } from "store/queueContext";

function useGetTrack() {
  const { currentIndex, queue } = useQueueState();
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const queueExists = queue && queue.length;
    if (queueExists) {
      const trackExists = currentIndex >= 0 && currentIndex < queue.length;
      if (trackExists) {
        setCurrentTrack(queue[currentIndex]);
      }
    }
  }, [currentIndex, queue, currentTrack, setCurrentTrack]);

  return { currentIndex, currentTrack };
}

export default useGetTrack;
