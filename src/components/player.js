import Button from "./button";
import Slider from "rc-slider";

import {
  mdiSkipNext,
  mdiShuffle,
  mdiPlaylistMusic,
  mdiDotsHorizontal,
  mdiPlayCircle,
  mdiSkipPrevious,
  mdiPlayCircleOutline,
  mdiRepeat,
  mdiVolumeHigh,
} from "@mdi/js";

import "rc-slider/assets/index.css";

function Player() {
  return (
    <div className={"player"}>
      <div className={"track-info"}>
        <div className={"track-info__thumbnail"}></div>
        <div className={"track-info__metadata"}>
          <div className={"track-info__metadata__title"}>
            Title of the track
          </div>
          <div className={"track-info__metadata__channel"}>
            Artist or channel name
          </div>
        </div>
      </div>

      <div className="player__controls">
        <div className={"player__controls__buttons"}>
          <Button icon={mdiSkipPrevious} type="player-control" />
          <Button icon={mdiPlayCircle} type="player-control-main" />
          <Button icon={mdiSkipNext} type="player-control" />
        </div>

        <div className={"player__slider"}>
          <span>00:00</span>
          <Slider />
          <span>00:00</span>
        </div>

        <div className={"player__controls__buttons"}>
          <Button icon={mdiRepeat} type="player-control" />
          <Button icon={mdiVolumeHigh} type="player-control" />
        </div>
      </div>
      <div className={"playlist-info"}>
        <Button icon={mdiPlaylistMusic} label={"Queue"} type={"large"} />
        <Button icon={mdiDotsHorizontal} type={"icon-large"} />
      </div>
    </div>
  );
}

export default Player;
