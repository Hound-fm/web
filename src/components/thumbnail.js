import LazyImg from "./lazyImg";
import clsx from "clsx";

function Thumbnail({ src, className }) {
  return (
    <div className={clsx("thumbnail", className)}>
      <LazyImg src={src} />
    </div>
  );
}

export default Thumbnail;
