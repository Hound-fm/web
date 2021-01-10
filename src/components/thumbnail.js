import clsx from "clsx";
import LazyImg from "./lazyImg";

function Thumbnail({ src, className, lazyload }) {
  return (
    <div className={clsx("thumbnail", className)}>
      <LazyImg src={src} lazyload={lazyload} />
    </div>
  );
}

export default Thumbnail;
