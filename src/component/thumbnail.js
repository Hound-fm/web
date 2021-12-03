import clsx from "clsx";
import { useEffect, useState } from "react";
import { getThumbnailCdnUrl } from "util/lbry";

export default function Thumbnail({
  src,
  rawSrc,
  width,
  height,
  className,
  children,
}) {
  const [source, setSource] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  useEffect(() => {
    if (rawSrc || src) {
      setSource(
        rawSrc || getThumbnailCdnUrl({ thumbnail: src, width, height })
      );
      // reset state
      setLoaded(false);
      setError(false);
    } else {
      // Reset state
      setSource(null);
      setLoaded(false);
      setError(false);
    }
  }, [src, rawSrc, width, height, setSource, setLoaded]);

  return (
    <div className={clsx("thumbnail", className)}>
      {source && (
        <img
          alt=""
          src={source}
          onLoad={handleLoad}
          onError={handleError}
          style={{ opacity: loaded && !error ? 1 : 0 }}
        />
      )}
      {children}
    </div>
  );
}
