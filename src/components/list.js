import Icon from "@mdi/react";
import Button from "./button";
import Thumbnail from "./thumbnail";
import { memo } from "react";
import { DateTime } from "luxon";
import { TagLink } from "./tag";
import { durationShortFormat } from "utils/format.js";
import { getStreamLink } from "utils/lbryplayer";
import { usePlayerState, usePlayerDispatch } from "store/playerContext";

import {
  mdiShareVariant,
  mdiCreation,
  mdiAntenna,
  mdiPlay,
  mdiArrowDownBold,
  mdiStar,
  mdiDotsVertical,
} from "@mdi/js";

const ItemPlayButton = ({ duration, id, name, title, author, thumbnail }) => {
  const state = usePlayerState();
  const dispatch = usePlayerDispatch();
  const handleClick = () => {
    dispatch({
      type: "play",
      data: { id, name, title, author, thumbnail, duration },
    });
  };

  return (
    <Button
      label={durationShortFormat(duration)}
      icon={mdiPlay}
      onClick={handleClick}
    />
  );
};

const Item = memo(
  ({
    id,
    name,
    title,
    tags,
    subtitle,
    thumbnail,
    message,
    author,
    date,
    action,
    duration,
    defaultTag,
  }) => {
    const tag = defaultTag || (tags.length ? tags[0] : false);
    return (
      <div className="item" data-name={name} data-id={id}>
        <div className="item-message">
          <div className="item-message__text">
            <Icon path={mdiAntenna} className="item-message__icon" />
            <span>
              {`${action}`}
              {author && ` ${author}`} &bull;{" "}
              {DateTime.fromISO(date).toRelative()}
            </span>
          </div>
          {tag && <TagLink tag={tag} />}
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
          <ItemPlayButton
            id={id}
            name={name}
            duration={duration}
            title={title}
            author={subtitle}
            thumbnail={thumbnail}
          />
          {/* <Button type="icon" icon={mdiShareVariant} /> */}
          <Button
            externalLink={getStreamLink({ name, id }, true)}
            type="icon"
            icon={mdiArrowDownBold}
          />
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

export function List({ dataItems, defaultTag }) {
  return (
    <div className="list">
      {dataItems &&
        dataItems.length &&
        dataItems.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            date={item.discovered_at}
            title={item.title}
            author={item.discovered_name}
            subtitle={item.publisher_title}
            duration={item.audio_duration}
            thumbnail={item.thumbnail_url}
            defaultTag={defaultTag}
            tags={item.genres.legth > 0 ? item.genres : item.tags || []}
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
