import { useState, useEffect } from "react";
import clsx from "clsx";
function LazyImg({ src, ...imgProps }) {
  const [state, setState] = useState("loading");

  const loaded = () => {
    setState("ready");
  };

  useEffect(() => {
    setState("loading");
  }, [src]);

  return (
    <img
      src={src}
      alt=""
      className={clsx("lazy-fade", state === "ready" ? "visible" : "hidden")}
      {...imgProps}
      loading={"lazy"}
      onLoad={loaded}
    />
  );
}

export default LazyImg;
