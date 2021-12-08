import { memo } from "react";

export const PlayCircle = memo((props) => {
  return (
    <svg
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="currentColor"
      {...props}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
});

export const Play = memo((props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
    </svg>
  );
});

export const Pause = memo((props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
    </svg>
  );
});

export const PauseCircle = memo((props) => {
  return (
    <svg
      enableBackground="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="currentColor"
      {...props}
    >
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <g>
          <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M11,16H9V8h2V16z M15,16h-2V8h2V16z" />
        </g>
      </g>
    </svg>
  );
});

export const BrokenHeart = memo((props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C8.17,3 8.82,3.12 9.44,3.33L13,9.35L9,14.35L12,21.35V21.35M16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35L11,14.35L15.5,9.35L12.85,4.27C13.87,3.47 15.17,3 16.5,3Z"
      />
    </svg>
  );
});

export const MenuRight = memo((props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M10,17L15,12L10,7V17Z" />
    </svg>
  );
});
