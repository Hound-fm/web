// Links
export const getRedirectLink = (id) => `https://odysee.com/$/search?q=${id}`;
export const getReportLink = (id) => `https://lbry.com/dmca/${id}`;

// Stream source
const STREAM_API = "https://cdn.lbryplayer.xyz/api/";
const STREAM_API_VERSION = 4;

export const getStreamLink = ({ name, id }, download) => {
  const downloadQuery = download ? "?download=true" : "";
  return (
    STREAM_API +
    `v${STREAM_API_VERSION}/` +
    `streams/free/${name}/${id}/test` +
    downloadQuery
  );
};

// Thubmnails
const THUMBNAIL_CDN_URL = "https://thumbnails.odysee.com/optimize/";
const THUMBNAIL_HEIGHT = 256;
const THUMBNAIL_WIDTH = 256;
const THUMBNAIL_QUALITY = 80;

export function getThumbnailCdnUrl(props) {
  const {
    thumbnail,
    height = THUMBNAIL_HEIGHT,
    width = THUMBNAIL_WIDTH,
    quality = THUMBNAIL_QUALITY,
  } = props;
  const opSize = `s:${width}:${height}`;
  const opQuality = `q:${quality}`;

  if (
    !THUMBNAIL_CDN_URL ||
    !thumbnail ||
    thumbnail.startsWith(THUMBNAIL_CDN_URL)
  ) {
    return thumbnail;
  }

  return THUMBNAIL_CDN_URL + `${opSize}/${opQuality}/plain/${thumbnail}`;
}
