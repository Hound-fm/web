export const queueReducer = (state, action) => {
  // Set current queue
  switch (action.type) {
    case "updateQueue": {
      const { index, queue } = action.data;
      const queueExists = queue && queue.length > 0;
      if (queueExists) {
        const trackExists = index >= 0 && index < queue.length;
        if (trackExists) {
          return { ...state, queue, currentTrack: index };
        }
        return { ...state, queue };
      }
      return state;
    }

    case "addToQueue": {
      const { queue } = state;
      const item = action.data;
      const queueExists = queue && queue.length > 0;
      if (queueExists) {
        const updatedQueue = state.queue.concat(item);
        return { ...state, queue: updatedQueue };
      }
      return state;
    }

    case "removeFromQueue": {
      const { queue } = state;
      const index = action.data;
      const queueExists = queue && queue.length > 0;
      if (queueExists) {
        const updatedQueue = queue.filter(
          (item, itemIndex) => itemIndex === index
        );
        const updatedIndex =
          state.currentIndex > index
            ? state.currentIndex - 1
            : state.currentIndex;
        return { ...state, queue: updatedQueue, currentIndex: updatedIndex };
      }
      return state;
    }

    // Set next queue
    case "setNextQueue": {
      const { items } = action.data;
      return { ...state, nextQueue: items };
    }

    case "loadNextQueue": {
      return { ...state, queue: state.nextQueue };
    }

    case "setTrack": {
      const index = action.data;
      const length = state.queue.length;
      const queueExists = state.queue && length > 0;

      if (queueExists && index >= 0 && index < length) {
        return { ...state, currentIndex: index };
      }

      return state;
    }

    // Set next track
    case "setNextTrack": {
      const next = state.currentIndex + 1;
      const length = state.queue.length;
      const queueExists = state.queue && length > 0;

      if (queueExists) {
        // Select next track
        if (next < length) {
          return { ...state, currentIndex: next };
        }
        // Restart queue position
        if (next >= length) {
          return { ...state, currentIndex: 0 };
        }
      }

      return state;
    }

    // Set previous track
    case "setPrevTrack": {
      const prev = state.currentIndex - 1;
      const length = state.queue.length;
      const queueExists = state.queue && length > 0;

      if (queueExists && prev >= 0) {
        return { ...state, currentIndex: prev };
      }

      return state;
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
