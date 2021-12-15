import { useEffect, useState, memo } from "react";
import Page from "component/page";
import PageHeader from "component/pageHeader";
import LoadingPage from "pages/loading";
import { ErrorAPIPage } from "pages/error";
import TrackList from "component/trackList";
import Button from "component/button";
import Link from "component/link";
import FavoriteButton from "component/favoriteButton";
import { useFetchExploreChannel } from "api";
import { Rss } from "lucide-react";
import { CollectionPreviewRow } from "component/collection";

const CHANNEL_TYPES = {
  artist: { name: "artist", content: "songs" },
  podcast_series: { name: "podcast", content: "episodes" },
};

export const ChannelPreview = memo(({ channel_id, channel_type }) => {
  const channelType = CHANNEL_TYPES[channel_type] || {};
  const [resultsData, setResultsData] = useState({});
  const { data, status, isError, isLoading } =
    useFetchExploreChannel(channel_id);
  const channelData = resultsData ? resultsData.channel : null;
  const title = channelData ? channelData.channel_title : "";
  const total = resultsData.latest && resultsData.latest.total.value;
  let genre =
    channelData && channelData.genres && channelData.genres.length
      ? channelData.genres[0]
      : null;

  if (!genre) {
    genre =
      channelData &&
      channelData.content_genres &&
      channelData.content_genres.length
        ? channelData.content_genres[0]
        : null;
  }
  // Todo: copy instead of open
  const openRSSLink = () => {
    if (channelData && channel_id) {
      window.open(
        `https://odysee.com/$/rss/${channelData.channel_name}:${channel_id[0]}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      if (data.data) {
        setResultsData(data.data);
      }
    }
  }, [data, status, setResultsData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  return (
    <Page>
      {channelData && (
        <PageHeader
          title={channelData.channel_title}
          subtitle={
            <>
              {channelType.name + (genre ? ` • ` : "")}
              {genre && <Link to={`/genre/${genre}`}> {genre} </Link>}
              {total && total > 1 ? ` • ${total} ${channelType.content}` : ""}
            </>
          }
          thumbnail={channelData.thumbnail}
          circularThumbnail={channelType.name === "artist"}
        >
          <div className={"header__actions"}>
            <FavoriteButton
              id={channelData.id}
              favoriteType={channelData.channel_type}
              className={"button--header button--favorite"}
            />
            <Button
              icon={Rss}
              className={"button--header"}
              onClick={openRSSLink}
            />
          </div>
        </PageHeader>
      )}
      {resultsData && resultsData.latest && (
        <CollectionPreviewRow
          queueTitle={`${title} • Latest`}
          title={"Latest"}
          collectionType={"music_recording"}
          collectionData={resultsData.latest}
          collectionLink={`/${channelType.name}/${channel_id}/latest`}
        />
      )}
      {resultsData && resultsData.popular && (
        <CollectionPreviewRow
          queueTitle={`${title} • Popular`}
          title={"Popular"}
          collectionType={"music_recording"}
          collectionData={resultsData.popular}
          collectionLink={`/${channelType.name}/${channel_id}/popular`}
        />
      )}
    </Page>
  );
});

export const ChannelPlaylist = memo(({ channel_id, sortBy }) => {
  const [resultsData, setResultsData] = useState({});
  const { data, status, isError, isLoading } = useFetchExploreChannel(
    channel_id,
    sortBy
  );
  const title =
    resultsData && resultsData.channel
      ? `${resultsData.channel.channel_title} • ${sortBy}`
      : "";

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      setResultsData(data.data);
    }
  }, [data, status, setResultsData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  return (
    <Page>
      {resultsData && resultsData[sortBy] && (
        <TrackList
          title={title}
          trackData={resultsData[sortBy].hits}
          queueTitle={title}
        />
      )}
    </Page>
  );
});
