import clsx from "clsx";
import { getThumbnailCdnUrl } from "utils/cdn";
import LazyImg from "./lazyImg";

function Thumbnail({ src, className, lazyload }) {
  return (
    <div className={clsx("thumbnail", className)}>
      <LazyImg
        src={getThumbnailCdnUrl({ thumbnail: src })}
        lazyload={lazyload}
      />
    </div>
  );
}

export default Thumbnail;
