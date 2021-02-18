import Icon from "@mdi/react";
import { Button, ButtonMenu } from "./button";
import Thumbnail from "./thumbnail";
import { memo, useCallback } from "react";
import { DateTime } from "luxon";
import { TagLink } from "./tag";
import { durationShortFormat } from "utils/format.js";
import { getStreamLink, getReportLink, getRedirectLink } from "utils/lbry";
import { useQueueDispatch } from "store/queueContext";
import { copyToClipboard } from "utils/clipboard";
import { ExternalLink } from "components/externalLink";

import { mdiPlay, mdiAntenna, mdiDotsVertical } from "@mdi/js";

const ItemPlayButton = ({
  duration,
  index,
  id,
  name,
  title,
  author,
  thumbnail,
}) => {
  const queueDispatch = useQueueDispatch();
  const handleClick = useCallback(() => {
    queueDispatch({
      type: "loadNextQueue",
    });
    queueDispatch({
      type: "setTrack",
      data: index,
    });
  }, [index, queueDispatch]);

  return (
    <Button
      label={durationShortFormat(duration)}
      icon={mdiPlay}
      onClick={handleClick}
    />
  );
};

const ItemMenuButton = ({ id, queueItem }) => {
  const copyId = useCallback(() => {
    copyToClipboard(id);
  }, [id]);

  const queueDispatch = useQueueDispatch();

  const addToQueue = useCallback(() => {
    queueDispatch({ type: "addToQueue", data: queueItem });
  }, [queueDispatch, queueItem]);

  const reportLink = getReportLink(id);

  const items = [
    { title: "Copy Id", id: "item-0", action: copyId },
    { title: "Add To Queue", id: "item-1", action: addToQueue },
    { title: "Report content", id: "item-2", externalLink: reportLink },
  ];

  return (
    <ButtonMenu
      type={"icon"}
      items={items}
      className={"button--menu"}
      icon={mdiDotsVertical}
    />
  );
};

const Item = memo(
  ({
    id,
    index,
    name,
    title,
    tags,
    queueItem,
    publisherId,
    subtitle,
    thumbnail,
    message,
    user,
    userId,
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
            <span className={"text-overflow--short"}>
              {`${action} by `}
              <ExternalLink to={getRedirectLink(userId)}>
                {user}
              </ExternalLink>{" "}
              &bull; {DateTime.fromISO(date).toRelative()}
            </span>
          </div>
          <div className={"item-message__actions"}>
            {tag && <TagLink tag={tag} />}
            <ItemMenuButton id={id} queueItem={queueItem} />
          </div>
        </div>
        <div className="item-data">
          <div className="item-thumbnail">
            <Thumbnail className="thumbnail--medium" src={thumbnail} />
          </div>
          <div className="item-header">
            <h3 className="item-title text-overflow--short">
              <ExternalLink to={getRedirectLink(id)}>{title}</ExternalLink>
            </h3>
            <h4 className="item-subtitle text-overflow--short">
              <ExternalLink to={getRedirectLink(publisherId)}>
                {subtitle}
              </ExternalLink>
            </h4>
          </div>
        </div>
        <div className="item-actions">
          <ItemPlayButton id={id} index={index} duration={duration} />
        </div>
      </div>
    );
  }
);

const ItemSmall = memo(({ id, title, subtitle, thumbnail }) => {
  return (
    <ExternalLink to={getRedirectLink(id)} className="item item--small">
      <div className="item-thumbnail item-thumbnail--small">
        <Thumbnail className="thumbnail--small" src={thumbnail} />
      </div>
      <div className="item-data">
        <div className="item-header">
          <div className="item-title">{title}</div>
          {subtitle && <div className="item-subtitle">{subtitle}</div>}
        </div>
      </div>
    </ExternalLink>
  );
});

export const List = memo(({ dataItems, defaultTag }) => {
  return (
    <div className="list">
      {dataItems &&
        dataItems.length &&
        dataItems.map((item, index) => (
          <Item
            key={item.id + index}
            id={item.id}
            index={index}
            name={item.name}
            date={item.discovered_at}
            title={item.title}
            user={item.discovered_name}
            userId={item.discovered_by}
            publisherId={item.publisher_id}
            subtitle={item.publisher_title}
            duration={item.audio_duration}
            thumbnail={item.thumbnail_url}
            queueItem={item}
            defaultTag={defaultTag}
            tags={item.genres}
            action="Discovered"
          />
        ))}
    </div>
  );
});

export const SimpleList = memo(({ dataItems }) => {
  return (
    <div className="list">
      {dataItems &&
        dataItems.length &&
        dataItems.map((item) => (
          <ItemSmall
            key={item.publisher_id}
            id={item.publisher_id}
            title={item.publisher_title}
            subtitle={item.publisher_name}
            thumbnail={item.thumbnail_url}
            action="Discovered"
          />
        ))}
    </div>
  );
});
