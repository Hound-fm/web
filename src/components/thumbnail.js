import clsx from "clsx";
import LazyImg from "./lazyImg";

function Thumbnail({ src, className }) {
  return (
    <div className={clsx("thumbnail", className)}>
      <LazyImg src={src} />
    </div>
  );
}

export default Thumbnail;
