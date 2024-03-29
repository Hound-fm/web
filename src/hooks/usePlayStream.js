import { useQueueUpdate } from "hooks/useQueue";
import { useState as useHookState } from "@hookstate/core";
import { globalPlayerState, globalPlaybackState } from "store";

export default function useSPlayStream({
  index,
  metadata,
  queueTitle,
  queueData,
}) {
  const playerState = useHookState(globalPlayerState);
  const playbackState = useHookState(globalPlaybackState);
  const currentTrack = playerState.currentTrack.value;
  const playback = playbackState.playback.value;
  const playbackSync = playbackState.playbackSync.value;
  const selected = currentTrack && metadata && metadata.id === currentTrack.id;
  const updateQueue = useQueueUpdate();

  const play = (e) => {
    // e.preventDefault()
    // e.stopPropagation();
    if (metadata && !currentTrack) {
      playbackState.playback.set("paused");
      playerState.currentTrack.set(metadata);
    } else if (metadata && currentTrack && metadata.id !== currentTrack.id) {
      playbackState.playback.set("paused");
      playerState.currentTrack.set(metadata);
    } else if (metadata && metadata.id === currentTrack.id && !playbackSync) {
      if (playback === "playing") {
        playbackState.playbackSync.set("paused");
      } else if (playback === "paused") {
        playbackState.playbackSync.set("playing");
      }
    }

    // Update queue
    if (queueTitle && queueData && queueData.hits && queueData.hits.length) {
      updateQueue({ title: queueTitle, data: queueData.hits, index });
    } else if (queueTitle && queueData && queueData.length) {
      updateQueue({ title: queueTitle, data: queueData, index });
    } else if (index) {
      updateQueue({ index });
    }
  };

  return { play, playback, selected };
}
