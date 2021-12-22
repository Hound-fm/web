import clsx from "clsx";
import Thumbnail from "component/thumbnail";
import Page from "component/page";
import { DateTime } from "luxon";
import { useFetchFeed } from "api";
import { useEffect, useState } from "react";
import Icon from "component/icon";
import Link from "component/link";
import { durationShortFormat } from "util/formatDuration";
import StreamPlayButton from "component/streamPlayButton";
import { Upload, Radio, Repeat } from "lucide-react";
import InfiniteScroller from "component/infiniteScroller";

const EVENT_ICON = { discover: Radio, publish: Upload, repost: Repeat };

const formatDate = (iso) =>
  DateTime.fromISO(iso).toRelativeCalendar({ base: DateTime.now() });

const EmbedStream = ({ eventData = {} }) => {
  console.info(eventData.id);
  return (
    <div className="embed-stream">
      <div className="stream__info">
        <Thumbnail src={eventData.thumbnail} className="stream__thumbnail" />
        <div className="stream__metadata">
          <div className="stream__title">{eventData.title}</div>
          <div className="stream__subtitle">{eventData.channel_title}</div>
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
};

const FeedEvent = ({ eventData = {}, showEmbedStream }) => {
  return (
    <div className={clsx("event", !showEmbedStream && "event--linked")}>
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
          <span className="event__author-link">{eventData.author_title}</span>
          {/* <span className="event__type">{action}</span> */}
          {eventData.event_date && (
            <>
              <span className="text-separator"> • </span>
              {formatDate(eventData.event_date)}
            </>
          )}
        </div>
      </div>
      <div className={"event_message"}>
        {showEmbedStream && <EmbedStream eventData={eventData} />}
      </div>
    </div>
  );
};

export default function Feed() {
  const { data, status } = useFetchFeed();
  const [resultsData, setResultsData] = useState([]);

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      if (data.data && data.data.hits) {
        const hits = data.data.hits;
        setResultsData(hits.hits);
      }
    }
  }, [data, status, setResultsData]);

  return (
    <Page title={"Feed"}>
      <InfiniteScroller rows={resultsData}>
        {(rows, rowdata, virtualRow) => {
          let showEmbedStream = true;
          let next = virtualRow.index + 1;
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
              eventData={feedEventData}
              showEmbedStream={showEmbedStream}
            />
          );
        }}
      </InfiniteScroller>
      {/*
      <section className="feed__container">
        {resultsData &&
          resultsData.map((feedEventRaw, index) => {
            let next = index + 1;
            let showEmbedStream = true;
            next = next > -1 ? resultsData[next] : false;

            const feedEventData = {
              ...feedEventRaw._source,
              id: feedEventRaw._source.event_stream_id,
            };

            // Stack events on stream

            if (next && next._source.event_stream_id === feedEventData.id) {
              showEmbedStream = false;
            }

            return (
              <FeedEvent
                key={feedEventRaw._id}
                eventData={feedEventData}
                showEmbedStream={showEmbedStream}
              />
            );
          })}

      </section>
      */}
    </Page>
  );
}
