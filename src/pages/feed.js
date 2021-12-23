import clsx from "clsx";
import Thumbnail from "component/thumbnail";
import Page from "component/page";
import { DateTime } from "luxon";
import { useFetchFeed } from "api";
import { useEffect, useState, useCallback, memo } from "react";
import Icon from "component/icon";
import Link from "component/link";
import { durationShortFormat } from "util/formatDuration";
import StreamPlayButton from "component/streamPlayButton";
import { Upload, Radio, Repeat } from "lucide-react";
import InfiniteScroller from "component/infiniteScroller";
import { WEB_DOMAIN } from "constants.js";

const EVENT_ICON = { discover: Radio, publish: Upload, repost: Repeat };
const EVENT_ACTIONS = {
  repost: "Reposted by ",
  publish: "Published by ",
  discover: "Discover by ",
};

const formatDate = (iso) =>
  DateTime.fromISO(iso, { zone: "utc" }).toRelativeCalendar();

const EmbedStream = memo(({ eventData = {} }) => {
  return (
    <div className="embed-stream">
      <div className="stream__info">
        <Thumbnail src={eventData.thumbnail} className="stream__thumbnail" />
        <div className="stream__metadata">
          <Link
            className="stream__title text-overflow-2"
            href={`${WEB_DOMAIN}/${eventData.url}`}
          >
            {eventData.title}
          </Link>
          <Link
            className="stream__subtitle text-overflow"
            to={`/${
              eventData.channel_type === "podcast_series" ? "podcast" : "artist"
            }/${eventData.channel_id}`}
          >
            {eventData.channel_title}
          </Link>
        </div>
      </div>
      <div className="stream__actions">
        {eventData.fee_amount ? (
          <div className="embed__button embed__price">
            <span>
              {eventData.fee_amount} {eventData.fee_currency}
            </span>
          </div>
        ) : (
          <StreamPlayButton className={"embed__button"} metadata={eventData}>
            {durationShortFormat(eventData.duration)}
          </StreamPlayButton>
        )}
        {eventData.genres &&
          eventData.genres.slice(0, 1).map((genre) => (
            <Link key={genre} to={`/genre/${genre}`} className="embed__button">
              {genre}
            </Link>
          ))}
      </div>
    </div>
  );
});

const FeedEvent = memo(({ eventData = {}, showEmbedStream, index }) => {
  return (
    <div
      className={clsx(
        "event",
        !showEmbedStream && "event--linked",
        index === 0 && "event--first"
      )}
    >
      <div className="event__header">
        {eventData.event_type && (
          <div
            className={`event__header__thumbnail event__header__thumbnail--${eventData.event_type}`}
          >
            <Icon
              icon={EVENT_ICON[eventData.event_type]}
              className={"icon button__icon"}
            />
          </div>
        )}
        <div className="event__header__data text-overflow">
          <Link
            title={`${EVENT_ACTIONS[eventData.event_type]} ${
              eventData.author_title
            }`}
            className="event__author-link"
            href={`${WEB_DOMAIN}/${eventData.author_url}`}
          >
            {eventData.author_title}
          </Link>
          {eventData.event_date && (
            <>
              <span className="text-separator"> • </span>
              <span title={eventData.event_date}>
                {formatDate(eventData.event_date)}
              </span>
            </>
          )}
        </div>
      </div>
      <div className={"event_message"}>
        {showEmbedStream && <EmbedStream eventData={eventData} />}
      </div>
    </div>
  );
});

export default function Feed() {
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useFetchFeed();

  const [resultsData, setResultsData] = useState([]);

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      if (data) {
        setResultsData(data);
      }
    }
  }, [data, status, setResultsData]);

  const eventRow = useCallback((virtualRow, rows) => {
    let showEmbedStream = true;
    let next = virtualRow.index + 1;
    if (rows && virtualRow.index < rows.length) {
      const rowdata = rows[virtualRow.index];
      next = next > -1 ? rows[next] : false;
      const feedEventData = {
        ...rowdata._source,
        id: rowdata._source.event_stream_id,
      };
      if (next && next._source.event_stream_id === feedEventData.id) {
        showEmbedStream = false;
      }
      return (
        <FeedEvent
          index={virtualRow.index}
          eventData={feedEventData}
          showEmbedStream={showEmbedStream}
        />
      );
    }
  }, []);

  return (
    <Page title={"Feed"}>
      <InfiniteScroller
        isFetching={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        data={resultsData}
      >
        {eventRow}
      </InfiniteScroller>
    </Page>
  );
}
