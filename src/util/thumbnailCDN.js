const THUMBNAIL_CDN_URL = "https://image-optimizer.vanwanet.com/?address=";
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

  if (
    !THUMBNAIL_CDN_URL ||
    !thumbnail ||
    thumbnail.startsWith(THUMBNAIL_CDN_URL)
  ) {
    return thumbnail;
  }

  if (thumbnail && !thumbnail.includes("https://spee.ch")) {
    return `${THUMBNAIL_CDN_URL}${thumbnail}&quality=${quality}&height=${height}&width=${width}`;
  }

  if (thumbnail && thumbnail.includes("https://spee.ch")) {
    return `${thumbnail}?quality=${quality}&height=${height}&width=${width}`;
  }

  return thumbnail;
}
