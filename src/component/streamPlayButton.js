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
  showPulse = false,
  children,
}) {
  const { play, playback, selected } = usePlayStream({
    index,
    metadata,
    queueTitle,
    queueData,
  });
  let buttonIcon = playback === "playing" && selected ? Pause : Play;

  return (
    <>
      {showPulse && (
        <div
          className={clsx(
            "pulse-wave",
            selected && playback === "playing" && "pulse-wave--active",
            className && `pulse-wave--${className}`
          )}
        />
      )}
      <Button
        icon={buttonIcon}
        className={clsx(className, selected && classNameActive)}
        onClick={play}
      >
        {children}
      </Button>
    </>
  );
}

export default memo(StreamPlayButton);
