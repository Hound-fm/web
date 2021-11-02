import {
  Volume1,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Layers,
} from "lucide-react";
import { PlayCircle, Pause } from "component/customIcons";
import Icon from "component/icon";
import Button from "component/button";
import Nouislider from "nouislider-react";
import { useMediaQuery } from "react-responsive";

function StreamInfo() {
  return (
    <div className="stream-info">
      <div className="stream-info__thumbnail" />
      <div className="stream-info__text">
        <div className="stream-info__title">The new song</div>
        <div className="stream-info__subtitle">Artist name</div>
      </div>
    </div>
  );
}

function MiniPlayer() {
  return (
    <div className="player player--mini">
      <StreamInfo />
      <div className="player__actions">
        <Button
          icon={PlayCircle}
          className={"player__main-action button--player-action"}
        />
      </div>
    </div>
  );
}

function MaximizedPlayer() {
  return (
    <div className="player player--max">
      <div className="stream-info__thumbnail" />
      <div className="stream-info__text">
        <div className="stream-info__title">The new song</div>
        <div className="stream-info__subtitle">Artist name</div>
      </div>
      <div className="player__main-controls">
        <div className="slider player__slider">
          <span className={"label"}>0:00</span>
          <Nouislider
            start={0}
            range={{ min: 0, max: 255 }}
            connect={[true, false]}
          />
          <span className={"label"}>0:00</span>
        </div>
        <div className="player__actions">
          <Button icon={Shuffle} className={"button--player-action"} />
          <Button icon={SkipBack} className={"button--player-action"} />
          <Button
            icon={PlayCircle}
            className={"player__main-action button--player-action"}
          />
          <Button icon={SkipForward} className={"button--player-action"} />
          <Button icon={Repeat} className={"button--player-action"} />
        </div>
      </div>
    </div>
  );
}

export default function Player() {
  const showMiniPlayer = useMediaQuery({
    query: "(max-width: 900px)",
  });

  if (showMiniPlayer) {
    return <MiniPlayer />;
  }

  return (
    <div className="player">
      <StreamInfo />
      <div className="player__main-controls">
        <div className="player__actions">
          <Button icon={Shuffle} className={"button--player-action"} />
          <Button icon={SkipBack} className={"button--player-action"} />
          <Button
            icon={PlayCircle}
            className={"player__main-action button--player-action"}
          />
          <Button icon={SkipForward} className={"button--player-action"} />
          <Button icon={Repeat} className={"button--player-action"} />
        </div>
        <div className="slider player__slider">
          <span className={"label"}>0:00</span>
          <Nouislider
            start={0}
            range={{ min: 0, max: 255 }}
            connect={[true, false]}
          />
          <span className={"label"}>0:00</span>
        </div>
      </div>

      <div className="player__controls player__actions">
        <Button
          icon={Layers}
          className={"button--text button--player-action"}
        />
        <Button icon={Volume1} className={"button--player-action"} />
        <div className="slider volume__slider">
          <Nouislider
            start={0}
            range={{ min: 0, max: 255 }}
            connect={[true, false]}
          />
        </div>
      </div>
    </div>
  );
}
