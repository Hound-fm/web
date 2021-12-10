import clsx from "clsx";
import { memo } from "react";
import Button from "component/button";
import { Play, Pause } from "component/customIcons";
import usePlayStream from "hooks/usePlayStream";



function StreamPlayButton({
  index,
  metadata,
  queueTitle,
  queueData,
  className,
  classNameActive,
}) {

  const { play, playback, selected } = usePlayStream({ index, metadata, queueTitle, queueData });
  let buttonIcon = playback === "playing" && selected ? Pause : Play;

  return (
    <Button
      icon={buttonIcon}
      className={clsx(className, selected && classNameActive)}
      onClick={play}
    />
  );
}

export default memo(StreamPlayButton);
