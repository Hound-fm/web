import { durationTrackFormat } from "util/formatDuration";
import Thumbnail from "component/thumbnail";

function TrackRow({ title, subtitle, duration, thumbnail }) {
  return (
    <div className="tracks-list__row">
      <div className="row__cell">
        <Thumbnail className="row__thumbnail" src={thumbnail} />
        <div className="row__data">
          <div className="row__title text-overflow">{title}</div>
          <div className="row__subtitle text-overflow">{subtitle}</div>
        </div>
      </div>
      <div className="row__cell">
        <div className="row__metadata">{durationTrackFormat(duration)}</div>
      </div>
    </div>
  );
}

export default function TrackListPreview({ tracksData }) {
  return (
    <div className="tracks-list">
      {tracksData.map((data) => (
        <TrackRow
          key={data.id}
          title={data.title}
          subtitle={data.channel_title}
          duration={data.duration}
          thumbnail={data.thumbnail}
        />
      ))}
    </div>
  );
}
