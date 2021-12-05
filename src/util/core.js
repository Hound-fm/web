import memoizeOne from "memoize-one";

const GREETINGS = [
  "Hello!",
  "Howdy!",
  "Welcome!",
  "Greetings!",
  "Hey, listen!",
  "Hello, stranger",
];

export function getRandomGreetings() {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

export const clamp = (num, min, max) => {
  if (min === max) return min;
  return Math.max(min, Math.min(num, max));
};

export function getColumnCount(grid) {
  const gridComputedStyle = window.getComputedStyle(grid);
  const gridColumnCount = gridComputedStyle
    .getPropertyValue("grid-template-columns")
    .split(" ").length;
  return gridColumnCount;
}

export function getTrackListType(tracks) {
  if (tracks && tracks.length > 0) {
    return tracks[0].stream_type;
  }
}

export function getResultType(result) {
  if (result.stream_type) {
    if (result.stream_type === "music_recording") {
      return "Song";
    }
    if (result.stream_type === "podcast_episode") {
      return "Episode";
    }
  }

  if (result.channel_type) {
    if (result.channel_type === "artist") {
      return "Artist";
    }
    if (result.channel_type === "podcast_series") {
      return "Podcast";
    }
  }

  if (result.label && result.category_type) {
    return "Genre";
  }
}

export function getSearchQueryParams(queryText = "", typeText = "") {
  const type = typeText.replace(/\s+/g, " ").trim();
  const query = queryText.replace(/\s+/g, " ").trim();
  const params = new URLSearchParams();

  if (query && query.length) {
    params.append("q", query);
  }

  if (type && type.length) {
    params.append("type", type);
  }

  return params.toString();
}

export const formatSearchQuery = memoizeOne(getSearchQueryParams);

export function getSmoothGradient(color, factor = 1) {
  return `linear-gradient(
      to top,
      rgb(${color}) 0%,
      rgba(${color}, 0.738) ${factor * 19}%,
      rgba(${color}, 0.541) ${factor * 34}%,
      rgba(${color}, 0.382) ${factor * 47}%,
      rgba(${color}, 0.278) ${factor * 56.5}%,
      rgba(${color}, 0.194) ${factor * 65}%,
      rgba(${color}, 0.126) ${factor * 73}%,
      rgba(${color}, 0.075) ${factor * 80.2}%,
      rgba(${color}, 0.042) ${factor * 86.1}%,
      rgba(${color}, 0.021) ${factor * 91}%,
      rgba(${color}, 0.008) ${factor * 95.2}%,
      rgba(${color}, 0.002) ${factor * 98.2}%,
      transparent 100%
    )`;
}

export const smoothGradient = memoizeOne(getSmoothGradient);
