import { useEffect, useState } from "react";
import Page from "component/page";
import ErrorPage from "pages/error";
import TrackList from "component/trackList";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useFetchExploreGenre } from "api";
import { CollectionGrid, CollectionPreviewRow } from "component/collection";
import { GENRES } from "constants.js";

const COLLECTION_TYPES_MAPPINGS = ["Latest", "Popular"];
const SORT_TYPES_MAPPINGS = ["latest", "popular"];

function ExplorePreview({ genre }) {
  const [resultsData, setResultsData] = useState({});
  const { data, status } = useFetchExploreGenre(genre);

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      const res = data.data;
      setResultsData(res);
    }
  }, [data, status, setResultsData]);

  return (
    <Page title={genre}>
      {resultsData && resultsData.latest && (
        <CollectionPreviewRow
          queueTitle={`${genre} · Latest`}
          title={"Latest"}
          collectionType={"music_recording"}
          collectionData={resultsData.latest}
          collectionLink={`/genre/${genre}/latest`}
        />
      )}
      {resultsData && resultsData.popular && (
        <CollectionPreviewRow
          queueTitle={`${genre} · Popular`}
          title={"Popular"}
          collectionType={"music_recording"}
          collectionData={resultsData.popular}
          collectionLink={`/genre/${genre}/popular`}
        />
      )}
    </Page>
  );
}

function ExploreList({ genre, sortBy }) {
  const [resultsData, setResultsData] = useState([]);
  const { data, status } = useFetchExploreGenre(genre, sortBy);

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      const res = data.data;
      if (res && res.hits && res.hits.length) {
        setResultsData(res.hits);
      }
    }
  }, [data, status, setResultsData]);

  return (
    <Page title={`${genre} · ${sortBy}`}>
      {resultsData && (
        <TrackList
          trackData={resultsData}
          queueTitle={`${genre} · ${sortBy}`}
        />
      )}
    </Page>
  );
}

export default function GenrePage() {
  const { genre, sortBy } = useParams();

  if (sortBy) {
    if (sortBy != "latest" && sortBy != "popular") {
      return <ErrorPage />;
    }
  }

  if (genre) {
    if (!GENRES.includes(genre)) {
      return <ErrorPage />;
    }
  }

  return sortBy ? (
    <ExploreList genre={genre} sortBy={sortBy} />
  ) : (
    <ExplorePreview genre={genre} />
  );
}
