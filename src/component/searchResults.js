import SectionHeader from "component/sectionHeader";
import { CollectionGrid, CollectionPreviewRow } from "component/collection";
import TrackListPreview from "component/trackListPreview";
import TrackList from "component/trackList";

import { Card } from "component/card";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useFetchResults } from "api";
import { getResultType, getTrackListType, formatSearchQuery } from "util/core";

const COLLECTION_TYPES_MAPPINGS = {
  genre: "Genres",
  artist: "Artists",
  music_recording: "Songs",
  podcast_series: "Podcasts",
  podcast_episode: "Episodes",
};

function SearchTopResults({
  searchQuery,
  showTracksLink,
  topResult,
  topTracks,
}) {
  const expanded = useMediaQuery({ query: "(max-width: 1080px)" });
  const gridStyle = expanded ? { gridAutoRows: "0fr" } : {};
  const topResultStyle = expanded
    ? { gridColumn: "1/-1", display: "block" }
    : {};
  const gridColumnStyle = expanded ? { gridColumn: "1/-1" } : {};
  const cardStyle = expanded ? { flexGrow: "0" } : {};
  const tracksListType = getTrackListType(topTracks);

  return (
    <div className="search__top-results" style={gridStyle}>
      {topResult && (
        <div className={"top-result"} style={topResultStyle}>
          <SectionHeader title="Top result" />
          <Card
            metadata={topResult}
            style={cardStyle}
            layout="horizontal"
            circularThumbnail={topResult.result_type === "Artist"}
            title={topResult.result_title}
            thumbnail={topResult.thumbnail}
            subtitle={topResult.stream_type && topResult.channel_title}
            label={topResult.result_type}
          />
        </div>
      )}
      {topTracks && topTracks.length > 0 && (
        <div className={"list-result"} style={gridColumnStyle}>
          <SectionHeader
            title={COLLECTION_TYPES_MAPPINGS[tracksListType]}
            expandLink={
              showTracksLink
                ? `/search?${formatSearchQuery(searchQuery, tracksListType)}`
                : null
            }
          />
          <TrackListPreview tracksData={topTracks} />
        </div>
      )}
    </div>
  );
}

function SearchTypeResults({ searchQuery, searchType = "" }) {
  const title = COLLECTION_TYPES_MAPPINGS[searchType];
  const [resultsData, setResultsData] = useState([]);
  const { data, status } = useFetchResults(searchQuery, searchType);

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      const res = data.data;
      setResultsData(res.hits.hits);
    }
  }, [data, status, setResultsData]);

  if (searchType == "music_recording" || searchType === "podcast_episode") {
    return <TrackList trackData={resultsData} title={title} />;
  }

  return (
    <CollectionGrid
      title={title}
      collectionData={resultsData}
      collectionType={searchType}
    />
  );
}

function SearchEmptyState() {
  return (
    <div className={"empty-state"}>
      <h1 className={"empty-state__title"}>No results found.</h1>
      <p className={"empty-state__message"}>
        Please make sure your words are spelled correctly or use less or
        different keywords.
      </p>
    </div>
  );
}

function SearchAllResults({ searchQuery }) {
  const title = "Browse all";
  const description = " ";
  const [topResultData, setTopResultData] = useState(null);
  const [resultsData, setResultsData] = useState({});
  const [topTracksData, setTopTracksData] = useState([]);
  const [topTracksCount, setTopTracksCount] = useState(0);
  const { data, isLoading, status } = useFetchResults(searchQuery);
  const [isEmpty, setIsEmpty] = useState(null);

  useEffect(() => {
    if (status == "success" && data) {
      const res = data.data;
      if (res.topResult) {
        // Process search topResults
        const topResult = res.topResult._source;
        topResult.id = res.topResult._id;
        topResult.result_type = getResultType(topResult);
        topResult.result_title =
          topResult.title || topResult.channel_title || topResult.label;

        setIsEmpty(false);
        setTopResultData(topResult);
        // Process top tracks
        if (res.topTracks) {
          const topTracks = res.topTracks.hits.map((track) => {
            const trackData = track._source;
            trackData.id = track._id;
            return trackData;
          });
          setTopTracksCount(res.topTracks.total.value);
          setTopTracksData(topTracks);
        }
        // Process results
        if (res.results) {
          setResultsData(res.results);
        }
      } else {
        setIsEmpty(true);
      }
    }
  }, [
    data,
    status,
    getResultType,
    setResultsData,
    setTopResultData,
    setTopTracksData,
    setTopTracksCount,
    setIsEmpty,
  ]);

  useEffect(() => {
    if (status == "success" && data && !isLoading) {
    } else if (!isLoading) {
      setIsEmpty(true);
    }
  }, [data, isLoading, status]);

  return (
    <>
      {isEmpty && !isLoading && <SearchEmptyState />}
      {!isEmpty && topResultData && (
        <SearchTopResults
          searchQuery={searchQuery}
          topResult={topResultData}
          showTracksLink={topTracksData.length < topTracksCount}
          topTracks={topTracksData}
        />
      )}
      {!isEmpty &&
        resultsData &&
        Object.entries(resultsData).map(([key, value], index) => (
          <CollectionPreviewRow
            key={`${key}-${index}-${value.hits[0]._id}-${value.total.value}`}
            title={COLLECTION_TYPES_MAPPINGS[key]}
            queueTitle={
              key === "Songs" || key === "Episodes"
                ? `Search Results · ${key}`
                : null
            }
            collectionType={key}
            collectionData={value}
            collectionLink={`/search?${formatSearchQuery(searchQuery, key)}`}
          />
        ))}
    </>
  );
}

export default function SearchResults({ searchQuery, searchType = "" }) {
  return !searchType ? (
    <SearchAllResults searchQuery={searchQuery} />
  ) : (
    <SearchTypeResults searchQuery={searchQuery} searchType={searchType} />
  );
}
