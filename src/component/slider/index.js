import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import { SliderRail, Handle, Track } from "./components"; // example render components - source below

const sliderStyle = {
  position: "relative",
  width: "100%",
  touchAction: "none",
};

const KEYS = ["ArrowRight", "ArrowUp", "ArrowDown", "ArrowLeft"];

export default function CustomSlider({
  disabled,
  values = [0],
  range = [0.0, 1.0],
  step = 0.025,
  onChange,
  onUpdate,
  onActive,
  onUserChange,
}) {
  const [userChange, setUserChange] = useState(false);
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);

  const [keyboardState, setKeyboardState] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const handleSlideStart = () => {
    setUserChange(true);
  };

  const handleSlideEnd = () => {
    setUserChange(false);
  };

  const onMouseOver = () => {
    setHover(true);
  };

  const onMouseOut = () => {
    setHover(false);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const onFocus = () => {
    setFocus(true);
  };

  const active = hover || userChange || focus;

  const onKeyDown = (e) => {
    if (KEYS.includes(e.key)) {
      setKeyboardState((prev) => {
        const newState = { ...prev };
        newState[e.key] = true;
        return newState;
      });
    }
  };

  const onKeyUp = (e) => {
    if (KEYS.includes(e.key)) {
      setKeyboardState((prev) => {
        const newState = { ...prev };
        newState[e.key] = false;
        return newState;
      });
    }
  };

  useEffect(() => {
    if (keyboardState) {
      const keyDown =
        keyboardState["ArrowRight"] ||
        keyboardState["ArrowLeft"] ||
        keyboardState["ArrowUp"] ||
        keyboardState["ArrowDown"];
      if (keyDown) {
        handleSlideStart();
      } else {
        handleSlideEnd();
      }
    }
  }, [keyboardState]);

  useEffect(() => {
    if (onUserChange) {
      onUserChange(userChange);
    }
  }, [userChange, onUserChange]);

  return (
    <div
      className={"slider__container"}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
    >
      <Slider
        mode={1}
        step={step}
        domain={range}
        rootStyle={sliderStyle}
        onUpdate={onUpdate}
        onChange={onChange}
        onSlideStart={handleSlideStart}
        onSlideEnd={handleSlideEnd}
        values={values}
        disabled={disabled}
        onMouseOut={onMouseOut}
        onMouseOver={onMouseOver}
        className={clsx(
          "react-compound-slider",
          active && "react-compound-slider--active"
        )}
      >
        <Rail>
          {({ getRailProps }) => (
            <SliderRail
              getRailProps={getRailProps}
              onSlideStart={handleSlideStart}
              onSlideEnd={handleSlideEnd}
            />
          )}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={range}
                  disabled={disabled}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  onKeyDown={onKeyDown}
                  onKeyUp={onKeyUp}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  className={"slider-tracks__track"}
                  key={id}
                  active={active}
                  source={source}
                  target={target}
                  disabled={disabled}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </Slider>
    </div>
  );
}
