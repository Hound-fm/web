import { useState, useEffect } from "react";
import { clamp } from "util/core";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { globalPlayerState } from "store";

export function useQueueLoad() {
  /*
  const { data, refetch } = useQuery("key", emulateFetch, {
    refetchOnWindowFocus: false,
    enabled: false, // turned off by default, manual refetch is needed
  });
  const loadQueue = () => {
    refetch();
  };
  return loadQueue;
  */
}

export function useQueueSlice() {
  const playerState = useHookState(globalPlayerState);
  const currentTrack = playerState.currentTrack.attach(Downgraded).value;
  const queueData = playerState.queueData.attach(Downgraded).value;
  const queueIndex = playerState.queueIndex.attach(Downgraded).value;

  const [state, setState] = useState({
    next: undefined,
    current: undefined,
  });

  useEffect(() => {
    if (!queueData || !queueData.length) {
      // Empty queue (Only current track)
      console.info(currentTrack);
      setState({ next: null, current: currentTrack ? [currentTrack] : null });
    } else if (queueData && queueData.length) {
      playerState.queueData.set((prevQueueData) => {
        if (!prevQueueData || !prevQueueData.length) {
          setState({ next: null, current: null });
          return prevQueueData;
        }
        const item = prevQueueData[queueIndex];
        const nextIndex = queueIndex + 1;

        if (item) {
          if (nextIndex < prevQueueData.length) {
            const next = prevQueueData.slice(nextIndex);
            setState({ next, current: [currentTrack] });
          } else {
            setState({ next: null, current: [currentTrack] });
          }
        } else {
          setState({
            next: null,
            current: currentTrack ? [currentTrack] : null,
          });
        }

        return prevQueueData;
      });
    }
    // eslint-disable-next-line
  }, [currentTrack, queueData, queueIndex]);
  return state;
}
export function useQueueUpdate() {
  const playerState = useHookState(globalPlayerState);
  const queueData = playerState.queueData.attach(Downgraded).get();
  const queueTitle = playerState.queueTitle.value;

  const updateQueue = ({ title, data, index }) => {
    if (title) {
      // Update queue data and title
      if (title !== queueTitle) {
        if (data && data.length) {
          playerState.queueData.set(data);
          playerState.queueTitle.set(title);
        }
        // Update queue data
      } else if (title === queueTitle) {
        if (data && data.length && data.length !== queueData.length) {
          playerState.queueData.set(data);
        }
      }
    }

    // Update queue index
    if (index >= 0) {
      if (data && data.length) {
        playerState.queueIndex.set(index);
      } else if (queueData && queueData.length) {
        playerState.queueIndex.set(index);
      }
    }
  };

  return updateQueue;
}

export function useQueueNavigation() {
  const playerState = useHookState(globalPlayerState);

  function queueNavigate(step, forceLoop) {
    const prevQueueData = playerState.queueData.attach(Downgraded).value;
    const loop = playerState.loop.value;
    if (loop === "once" && !forceLoop) return;

    playerState.queueIndex.set((prev) => {
      const min = 0;
      const max = prevQueueData ? prevQueueData.length - 1 : 0;
      const next = prev + step;
      let index = prev;
      // Repeat playlist
      if (next === prevQueueData.length && loop) {
        index = 0;
      } else {
        // Play next track
        index = clamp(next, min, max);
      }
      if (prevQueueData && prevQueueData.length) {
        const item = prevQueueData[index];
        if (item && item._id && item._source) {
          const track = item._source;
          track.id = item._id;
          playerState.currentTrack.set(track);
        } else if (item && item.id) {
          playerState.currentTrack.set(item);
        }
        return index;
      }
      return prev;
    });
  }

  // Next track on queue
  const queueNext = (loop) => {
    queueNavigate(1, loop);
  };

  // Previous track on queue
  const queuePrev = () => {
    queueNavigate(-1);
  };

  return { queuePrev, queueNext };
}
