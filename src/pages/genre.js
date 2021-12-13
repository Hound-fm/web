import { useEffect, useState, memo } from "react";
import Page from "component/page";
import LoadingPage from "pages/loading";
import { ErrorNotFoundPage, ErrorAPIPage } from "pages/error";
import TrackList from "component/trackList";
import { useParams } from "react-router-dom";
import { useFetchExploreGenre } from "api";
import { CollectionPreviewRow } from "component/collection";
import { GENRES } from "constants.js";

const ExplorePreview = memo(({ genre }) => {
  const [resultsData, setResultsData] = useState({});
  const { data, status, isError, isLoading } = useFetchExploreGenre(genre);

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
    <Page title={genre}>
      {resultsData && resultsData.latest && (
        <CollectionPreviewRow
          queueTitle={`${genre} • Latest`}
          title={"Latest"}
          collectionType={"music_recording"}
          collectionData={resultsData.latest}
          collectionLink={`/genre/${genre}/latest`}
        />
      )}
      {resultsData && resultsData.popular && (
        <CollectionPreviewRow
          queueTitle={`${genre} • Popular`}
          title={"Popular"}
          collectionType={"music_recording"}
          collectionData={resultsData.popular}
          collectionLink={`/genre/${genre}/popular`}
        />
      )}
    </Page>
  );
});

const ExploreList = memo(({ genre, sortBy }) => {
  const [resultsData, setResultsData] = useState([]);
  const { data, status, isLoading, isError } = useFetchExploreGenre(
    genre,
    sortBy
  );

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      const res = data.data;
      if (res && res.hits && res.hits.length) {
        setResultsData(res.hits);
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
      {resultsData && (
        <TrackList
          title={`${genre} • ${sortBy}`}
          trackData={resultsData}
          queueTitle={`${genre} • ${sortBy}`}
        />
      )}
    </Page>
  );
});

export default function GenrePage() {
  const { genre, sortBy } = useParams();

  if (sortBy) {
    if (sortBy !== "latest" && sortBy !== "popular") {
      return <ErrorNotFoundPage />;
    }
  }

  if (genre) {
    if (!GENRES.includes(genre)) {
      return <ErrorNotFoundPage />;
    }
  }

  return sortBy ? (
    <ExploreList genre={genre} sortBy={sortBy} />
  ) : (
    <ExplorePreview genre={genre} />
  );
}
