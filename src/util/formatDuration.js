import { Duration } from "luxon";
import memoizeOne from "memoize-one";

const getDurationShortFormat = (seconds = 0) => {
  const duration = Duration.fromObject({ seconds });
  const hours = duration.as("hours");
  if (hours >= 1) {
    return hours.toFixed() + " hrs";
  }
  const minutes = duration.as("minutes");
  if (minutes >= 1) {
    return minutes.toFixed() + " min ";
  }
  return seconds.toFixed() + " sec ";
};

export const durationShortFormat = memoizeOne(getDurationShortFormat);

// Simplified version ( not leading zeros )
export const getDurationTrackFormat = (seconds) => {
  const duration = Duration.fromObject({ seconds });
  if (!seconds || seconds === 0) {
    return "0:00";
  }
  if (seconds > 3600) {
    return duration.toFormat("h:mm:ss");
  }
  return duration.toFormat("m:ss");
};

export const durationTrackFormat = memoizeOne(getDurationTrackFormat);
