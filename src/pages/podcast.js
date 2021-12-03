import { useEffect, useState, memo } from "react";
import Page from "component/page";
import PageHeader from "component/pageHeader";
import LoadingPage from "pages/loading";
import { ErrorNotFoundPage, ErrorAPIPage } from "pages/error";
import TrackList from "component/trackList";
import Button from "component/button";
import FavoriteButton from "component/favoriteButton";
import { useParams } from "react-router-dom";
import { useFetchExploreChannel } from "api";
import { CollectionPreviewRow } from "component/collection";

const PodcastPreview = memo(({ channel_id }) => {
  const [resultsData, setResultsData] = useState({});
  const { data, status, isLoading, isError } =
    useFetchExploreChannel(channel_id);
  const channelData = resultsData ? resultsData.channel : null;
  const title = channelData ? channelData.channel_title : "";

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
          thumbnail={channelData.thumbnail}
        >
          <div className={"header__actions"}>
            <FavoriteButton
              id={channelData.id}
              favoriteType={channelData.channel_type}
              className={"button--favorite"}
            />
          </div>
        </PageHeader>
      )}
      {resultsData && resultsData.latest && (
        <CollectionPreviewRow
          queueTitle={`${title} · Latest`}
          title={"Latest"}
          collectionType={"podcast_episode"}
          collectionData={resultsData.latest}
          collectionLink={`/podcast/${channel_id}/latest`}
        />
      )}
      {resultsData && resultsData.popular && (
        <CollectionPreviewRow
          queueTitle={`${title} · Popular`}
          title={"Popular"}
          collectionType={"podcast_episode"}
          collectionData={resultsData.popular}
          collectionLink={`/podcast/${channel_id}/popular`}
        />
      )}
    </Page>
  );
});

const PodcastList = memo(({ channel_id, sortBy }) => {
  const [resultsData, setResultsData] = useState({});
  const { data, status, isError, isLoading } = useFetchExploreChannel(
    channel_id,
    sortBy
  );
  const title =
    resultsData && resultsData.channel
      ? `${resultsData.channel.channel_title} · ${sortBy}`
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
    <Page title={title}>
      {resultsData && resultsData[sortBy] && (
        <TrackList trackData={resultsData[sortBy].hits} queueTitle={title} />
      )}
    </Page>
  );
});

export default function PodcastPage() {
  const { channel_id, sortBy } = useParams();
  if (sortBy) {
    if (sortBy !== "latest" && sortBy !== "popular") {
      return <ErrorNotFoundPage />;
    }
  }
  return sortBy ? (
    <PodcastList channel_id={channel_id} sortBy={sortBy} />
  ) : (
    <PodcastPreview channel_id={channel_id} />
  );
}
