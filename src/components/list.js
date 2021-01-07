import Icon from "@mdi/react";
import Button from "./button";
import Thumbnail from "./thumbnail";
import { memo } from "react";
import { DateTime, Duration } from "luxon";

import {
  mdiShareVariant,
  mdiCreation,
  mdiAntenna,
  mdiPlay,
  mdiArrowDownBold,
} from "@mdi/js";

const shortFormat = (seconds) => {
  const duration = Duration.fromObject({ seconds });

  const hours = duration.as("hours");
  if (hours >= 1) {
    return hours.toFixed() + " hrs";
  }

  const minutes = duration.as("minutes");
  if (minutes >= 1) {
    return minutes.toFixed() + " min";
  }

  return seconds.toFixed() + " sec";
};

const Item = memo(
  ({
    title,
    tags,
    subtitle,
    thumbnail,
    message,
    author,
    date,
    action,
    duration,
  }) => {
    const tag = tags.length ? tags[0] : false;
    return (
      <div className="item">
        <div className="item-message">
          <div className="item-message__text">
            <Icon path={mdiAntenna} className="item-message__icon" />
            <span>
              {`${action} by ${author}`} &bull;{" "}
              {DateTime.fromISO(date).toRelative()}
            </span>
          </div>
          {tag && <a className="item-tag">{tag}</a>}
        </div>
        <div className="item-data">
          <div className="item-thumbnail">
            <Thumbnail className="thumbnail--medium" src={thumbnail} />
          </div>
          <div className="item-header">
            <h3 className="item-title">{title}</h3>
            <h4 className="item-subtitle">{subtitle}</h4>
          </div>
        </div>
        <div className="item-actions">
          <Button label={shortFormat(duration)} icon={mdiPlay} />
          {/* <Button type="icon" icon={mdiShareVariant} /> */}
          <Button type="icon" icon={mdiArrowDownBold} />
        </div>
      </div>
    );
  }
);

const ItemSmall = memo(({ title, subtitle, thumbnail }) => {
  return (
    <div className="item item--small">
      <div className="item-thumbnail item-thumbnail--small">
        <Thumbnail className="thumbnail--small" src={thumbnail} />
      </div>
      <div className="item-data">
        <div className="item-header">
          <div className="item-title">{title}</div>
          <div className="item-subtitle">{subtitle}</div>
        </div>
      </div>
    </div>
  );
});

export function List({ dataItems }) {
  return (
    <div className="list">
      {dataItems &&
        dataItems.length &&
        dataItems.map((item) => (
          <Item
            key={item.id}
            date={item.discovered_at}
            title={item.title}
            author={item.discovered_name}
            subtitle={item.publisher_title}
            duration={item.audio_duration}
            thumbnail={item.thumbnail_url}
            tags={item.genres || []}
            action="Discovered"
          />
        ))}
    </div>
  );
}

export function SimpleList({ dataItems }) {
  return (
    <div className="list">
      {dataItems &&
        dataItems.length &&
        dataItems.map((item) => (
          <ItemSmall
            key={item.publisher_id}
            title={item.publisher_title}
            subtitle={item.publisher_name}
            thumbnail={item.thumbnail_url}
            action="Discovered"
          />
        ))}
    </div>
  );
}
