export function PlayCircle(props) {
  return (
    <svg
      version="1.1"
      width="48"
      height="48"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="currentcolor"
        d="M24,0.5C11,0.5,0.5,11,0.5,24S11,47.5,24,47.5S47.5,37,47.5,24S37,0.5,24,0.5z M32.2,25.1l-11.5,7.8
         c-0.4,0.3-0.9,0.3-1.3,0.1c-0.4-0.2-0.7-0.7-0.7-1.1V16.2c0-0.5,0.3-0.9,0.7-1.1c0.4-0.2,0.9-0.2,1.3,0.1L32.2,23
         c0.4,0.2,0.6,0.6,0.6,1.1C32.8,24.6,32.6,24.8,32.2,25.1z"
      />
    </svg>
  );
}


export function Play(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
    </svg>
  )
}

export function Pause(props) {
  return (
    <svg
      version="1.1"
      width="48"
      height="48"
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      {...props}
    >
      <path
        fill="currentcolor"
        d="M24,.5A23.5,23.5,0,1,0,47.5,24,23.5,23.5,0,0,0,24,.5ZM22,31.13a1.77,1.77,0,0,1-3.53,0V17.81a1.77,1.77,0,1,1,3.53,0Zm7.44,0a1.76,1.76,0,0,1-3.52,0V17.81a1.76,1.76,0,1,1,3.52,0Z"
        transform="translate(-0.5 -0.5)"
      />
    </svg>
  );
}
