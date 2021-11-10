import React, { Fragment } from "react";
import PropTypes from "prop-types";

// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle = {
  position: "absolute",
  width: "100%",
  height: 24,
  transform: "translate(0%, -50%)",
  borderRadius: 7,
  cursor: "pointer",
  // border: '1px solid white',
};

const railInnerStyle = {
  position: "absolute",
  width: "100%",
  height: 5,
  transform: "translate(0%, -50%)",
  borderRadius: 5,
  pointerEvents: "none",
  backgroundColor: "rgba(150,150,150, 0.3)",
};

export function SliderRail({ getRailProps, onSlideStart, onSlideEnd }) {
  const { onMouseDown, ...railProps } = getRailProps();
  const handleMouseDown = (e) => {
    if (onSlideStart) {
      onSlideStart();
    }
    onMouseDown(e);
  };

  return (
    <Fragment>
      <div
        className={"slider__area"}
        style={railOuterStyle}
        onMouseUp={onSlideEnd}
        onMouseDown={handleMouseDown}
        {...railProps}
      />
      <div style={railInnerStyle} />
    </Fragment>
  );
}

SliderRail.propTypes = {
  getRailProps: PropTypes.func.isRequired,
};

// *******************************************************
// KEYBOARD HANDLE COMPONENT
// Uses a button to allow keyboard events
// *******************************************************
export function Handle({
  domain: [min, max],
  handle: { id, value, percent },
  onBlur,
  onFocus,
  disabled,
  onKeyDown,
  onKeyUp,
  getHandleProps,
}) {
  const { onKeyDown: handleKeyDownEvent, ...handleProps } = getHandleProps(id);

  const handleKeyDown = (e) => {
    onKeyDown(e);
    handleKeyDownEvent(e);
  };

  return (
    <button
      className={"slider__handler"}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        left: `${percent}%`,
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        width: 12,
        height: 12,
        borderRadius: "50%",
        boxShadow: disabled ? "none" : "1px 1px 1px 1px rgba(0, 0, 0, 0.3)",
        backgroundColor: disabled ? "transparent" : "#fff",
      }}
      onKeyDown={handleKeyDown}
      onKeyUp={onKeyUp}
      {...handleProps}
    />
  );
}

Handle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Handle.defaultProps = {
  disabled: false,
};

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export function Track({ source, active, target, getTrackProps, disabled }) {
  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(0%, -50%)",
        height: railInnerStyle.height,
        zIndex: 1,
        backgroundColor: disabled
          ? "transparent"
          : active
          ? "var(--accent-color)"
          : "rgba(255,255,255, 0.4)",
        borderRadius: railInnerStyle.borderRadius,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
        pointerEvents: "none",
      }}
      {...getTrackProps()}
    />
  );
}

Track.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getTrackProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Track.defaultProps = {
  disabled: false,
};

// *******************************************************
// TICK COMPONENT
// *******************************************************
export function Tick({ tick, count, format }) {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          marginTop: 14,
          width: 1,
          height: 5,
          backgroundColor: "rgb(200,200,200)",
          left: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          position: "absolute",
          marginTop: 22,
          fontSize: 10,
          textAlign: "center",
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        {format(tick.value)}
      </div>
    </div>
  );
}

Tick.propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
  format: PropTypes.func.isRequired,
};

Tick.defaultProps = {
  format: (d) => d,
};
