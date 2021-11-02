import { useEffect, useState } from "react";
import Page from "component/page";
import TrackList from "component/trackList";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import { useMediaQuery } from "react-responsive";
import { useLocation, useParams } from "react-router-dom";
import { useFetchExploreGenre } from "api";
import { CollectionGrid, CollectionPreviewRow } from "component/collection";

const categories = [
  { title: "podcasts", color: "188,43,71" },
  { title: "instrumental", color: "187,27,47" },
  { title: "electronic", color: "61, 16, 135" },
  { title: "rock", color: "214, 48, 49" },
  { title: "house", color: "148,75,137" },
  { title: "hip-hop", color: "108, 39, 62" },
  { title: "beat", color: "61, 109, 101" },
  { title: "ambient", color: "95, 7, 78" },
  { title: "trap", color: "60,67,111" },
  { title: "reggae", color: "19, 98, 53" },
  { title: "jungle", color: "207,147,85" },
  { title: "pop", color: "159, 38, 94" },
  { title: "psychedelic", color: "9, 179, 172" },
  { title: "chill", color: "226, 11, 108" },
  { title: "edm", color: "10, 167, 96" },
  { title: "industrial", color: "228, 170, 7" },
  { title: "techno", color: "41, 27, 120" },
  { title: "folk", color: "98, 115, 61" },
];

const COLLECTION_TYPES_MAPPINGS = ["Latest", "Popular"];

function ExplorePreview({ genre }) {
  const [resultsData, setResultsData] = useState([]);
  const { data, status } = useFetchExploreGenre(genre);

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      const res = data.data;
      console.info(res);
      setResultsData(res);
    }
  }, [data, status, setResultsData]);

  return (
    <Page title={genre}>
      {resultsData &&
        resultsData.map((data, index) => (
          <CollectionPreviewRow
            key={`${genre}-${index}-${data.hits.total.value}`}
            title={COLLECTION_TYPES_MAPPINGS[index]}
            collectionType={"music_recording"}
            collectionData={data.hits}
            collectionLink={`/genre/${genre}/latest`}
          />
        ))}
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
      setResultsData(res.hits);
    }
  }, [data, status, setResultsData]);

  return (
    <Page title={genre}>
      {resultsData && <TrackList trackData={resultsData} />}
    </Page>
  );
}

export default function GenrePage() {
  const { genre, sortBy } = useParams();
  return sortBy ? (
    <ExploreList genre={genre} sortBy={sortBy} />
  ) : (
    <ExplorePreview genre={genre} />
  );
}
