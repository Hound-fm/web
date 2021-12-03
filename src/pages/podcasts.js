import { useEffect, useState } from "react";
import Page from "component/page";
import TrackList from "component/trackList";
import LoadingPage from "pages/loading";
import { ErrorNotFoundPage, ErrorAPIPage } from "pages/error";
import { useParams } from "react-router-dom";
import { useFetchExplorePodcasts } from "api";
import { CollectionPreviewRow } from "component/collection";

function ExplorePreview({ sortBy }) {
  const [resultsData, setResultsData] = useState({});
  const { data, status, isLoading, isError } = useFetchExplorePodcasts(sortBy);

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      const res = data.data;
      setResultsData(res);
    }
  }, [data, status, setResultsData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  return (
    <Page title={"Podcasts"}>
      {resultsData && resultsData.latest && (
        <CollectionPreviewRow
          queueTitle={`Podcasts · Latest`}
          title={"Latest"}
          collectionType={"podcast_episode"}
          collectionData={resultsData.latest}
          collectionLink={`/podcasts/latest`}
        />
      )}
      {resultsData && resultsData.popular && (
        <CollectionPreviewRow
          queueTitle={`Podcasts · Popular`}
          title={"Popular"}
          collectionType={"podcast_episode"}
          collectionData={resultsData.popular}
          collectionLink={`/podcasts/popular`}
        />
      )}
    </Page>
  );
}

function ExploreList({ sortBy }) {
  const [resultsData, setResultsData] = useState([]);
  const { data, status, isLoading, isError } = useFetchExplorePodcasts(sortBy);

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      const res = data.data;
      setResultsData(res.hits);
    }
  }, [data, status, setResultsData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  return (
    <Page title={`Podcasts · ${sortBy}`}>
      {resultsData && (
        <TrackList
          trackData={resultsData}
          queueTitle={`Podcasts · ${sortBy}`}
        />
      )}
    </Page>
  );
}

export default function PodcastsPage() {
  const { sortBy } = useParams();
  if (sortBy) {
    if (sortBy !== "latest" && sortBy !== "popular") {
      return <ErrorNotFoundPage />;
    }
  }
  return sortBy ? <ExploreList sortBy={sortBy} /> : <ExplorePreview />;
}
