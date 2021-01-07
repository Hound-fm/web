import { useState } from "react";

function LazyImg({ src, ...imgProps }) {
  const [state, setState] = useState("loading");
  const loaded = () => {
    setState("ready");
  };

  return (
    <img
      src={src}
      loading="lazy"
      className={"lazy-fade" + " " + (state === "ready" ? "visible" : "hidden")}
      {...imgProps}
      onLoad={loaded}
    />
  );
}

export default LazyImg;
