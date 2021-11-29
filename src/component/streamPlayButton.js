import clsx from "clsx";
import Icon from "component/icon";
import Button from "component/button";
import { Play, Pause } from "component/customIcons";
import { useQueueUpdate } from "hooks/useQueue";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { globalPlayerState } from "store";

export default function StreamPlayButton({
  index,
  metadata,
  queueTitle,
  queueData,
  className,
  classNameActive,
}) {
  const playerState = useHookState(globalPlayerState);
  const currentTrack = playerState.currentTrack.value;
  const playbackState = playerState.playbackState.value;
  const playbackStateSync = playerState.playbackStateSync.value;
  const selected = currentTrack && metadata && metadata.id == currentTrack.id;
  const updateQueue = useQueueUpdate();

  const handleClick = (e) => {
    e.stopPropagation();
    if (metadata && !currentTrack) {
      playerState.playbackState.set("paused");
      playerState.currentTrack.set(metadata);
    } else if (metadata && currentTrack && metadata.id !== currentTrack.id) {
      playerState.playbackState.set("paused");
      playerState.currentTrack.set(metadata);
    } else if (
      metadata &&
      metadata.id === currentTrack.id &&
      !playbackStateSync
    ) {
      if (playbackState === "playing") {
        playerState.playbackStateSync.set("paused");
      } else if (playbackState == "paused") {
        playerState.playbackStateSync.set("playing");
      }
    }

    // Update queue
    if (queueTitle && queueData && queueData.hits && queueData.hits.length) {
      updateQueue({ title: queueTitle, data: queueData.hits, index });
    } else if (queueTitle && queueData && queueData.length) {
      updateQueue({ title: queueTitle, data: queueData, index });
    }
  };

  let buttonIcon = playbackState === "playing" && selected ? Pause : Play;

  return (
    <Button
      icon={buttonIcon}
      className={clsx(className, selected && classNameActive)}
      onClick={handleClick}
    />
  );
}
