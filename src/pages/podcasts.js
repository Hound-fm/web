import { useEffect, useState } from "react";
import Page from "component/page";
import TrackList from "component/trackList";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import { useMediaQuery } from "react-responsive";
import { useLocation, useParams } from "react-router-dom";
import { useFetchExplorePodcasts } from "api";
import { CollectionGrid, CollectionPreviewRow } from "component/collection";

const COLLECTION_TYPES_MAPPINGS = ["Latest", "Popular"];
const SORT_TYPES_MAPPINGS = ["latest", "popular"];

function ExplorePreview({ sortBy }) {
  const [resultsData, setResultsData] = useState({});
  const { data, status } = useFetchExplorePodcasts(sortBy);

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      const res = data.data;
      setResultsData(res);
    }
  }, [data, status, setResultsData]);

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
  const { data, status } = useFetchExplorePodcasts(sortBy);

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      const res = data.data;
      setResultsData(res.hits);
    }
  }, [data, status, setResultsData]);

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
  return sortBy ? <ExploreList sortBy={sortBy} /> : <ExplorePreview />;
}