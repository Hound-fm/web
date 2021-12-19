import SectionHeader from "component/sectionHeader";
import { CollectionGrid, CollectionPreviewRow } from "component/collection";
import TrackListPreview from "component/trackListPreview";
import TrackList from "component/trackList";
import LoadingPage from "pages/loading";
import { ErrorAPIPage } from "pages/error";
import { durationShortFormat } from "util/formatDuration";
import { Card } from "component/card";
import { useEffect, useState, memo } from "react";
import { useFetchResults } from "api";
import { getResultType, getTrackListType, formatSearchQuery } from "util/core";

const COLLECTION_TYPES_MAPPINGS = {
  genre: "Genres",
  artist: "Artists",
  music_recording: "Songs",
  podcast_series: "Podcasts",
  podcast_episode: "Episodes",
};

const SearchTopResults = memo(
  ({ searchQuery, showTracksLink, topResult, topTracks }) => {
    const tracksListType = getTrackListType(topTracks);
    const rawThumbnail = topResult.label
      ? "/images/" +
        topResult.label.replace(/\s+/g, "-").trim().toLowerCase() +
        ".jpg"
      : false;

    return (
      <div className="search__top-results">
        {topResult && (
          <div className={"top-result"}>
            <SectionHeader title="Top result" />
            <Card
              metadata={topResult}
              layout="horizontal"
              title={topResult.result_title}
              thumbnail={topResult.thumbnail}
              rawThumbnail={rawThumbnail}
              subtitle={topResult.stream_type && topResult.channel_title}
              label={
                topResult.result_type +
                (topResult.duration
                  ? ` •  ${durationShortFormat(topResult.duration)} `
                  : "")
              }
            />
          </div>
        )}
        {topTracks && topTracks.length > 0 && (
          <div className={"list-result"}>
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
);

const SearchTypeResults = memo(({ searchQuery, searchType = "" }) => {
  const title = COLLECTION_TYPES_MAPPINGS[searchType];
  const [isEmpty, setIsEmpty] = useState(null);
  const [resultsData, setResultsData] = useState([]);
  const { data, status, isLoading, isError } = useFetchResults(
    searchQuery,
    searchType
  );
  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      const res = data.data;
      if (res && res.hits && res.hits.hits && res.hits.hits.length) {
        setResultsData(res.hits.hits);
      } else {
        setIsEmpty(true);
      }
    }
  }, [data, status, setResultsData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  if (isEmpty) {
    return <SearchEmptyState searchQuery={searchQuery} />;
  }

  if (searchType === "music_recording" || searchType === "podcast_episode") {
    return <TrackList trackData={resultsData} title={title} />;
  }

  return (
    <CollectionGrid
      title={title}
      collectionData={resultsData}
      collectionType={searchType}
    />
  );
});

const SearchEmptyState = memo(({ searchQuery }) => {
  return (
    <div className={"empty-state"}>
      <h1 className={"empty-state__title"}>No results</h1>
      <p className={"empty-state__message"}>
        Looks like there are no results for {`"${searchQuery}"`}, <br /> please
        try something different.
      </p>
    </div>
  );
});

const SearchAllResults = memo(({ searchQuery }) => {
  const [topResultData, setTopResultData] = useState(null);
  const [resultsData, setResultsData] = useState({});
  const [topTracksData, setTopTracksData] = useState([]);
  const [topTracksCount, setTopTracksCount] = useState(0);
  const { data, isLoading, isError, status } = useFetchResults(searchQuery);
  const [isEmpty, setIsEmpty] = useState(null);

  useEffect(() => {
    if (status === "success" && data) {
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
    setResultsData,
    setTopResultData,
    setTopTracksData,
    setTopTracksCount,
    setIsEmpty,
  ]);

  useEffect(() => {
    if (status === "success" && data && !isLoading) {
    } else if (!isLoading) {
      setIsEmpty(true);
    }
  }, [data, isLoading, status]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  return (
    <>
      {isEmpty && <SearchEmptyState searchQuery={searchQuery} />}
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
                ? `Search Results • ${key}`
                : null
            }
            collectionType={key}
            collectionData={value}
            collectionLink={`/search?${formatSearchQuery(searchQuery, key)}`}
          />
        ))}
    </>
  );
});

function SearchResults({ searchQuery, searchType = "" }) {
  return !searchType ? (
    <SearchAllResults searchQuery={searchQuery} />
  ) : (
    <SearchTypeResults searchQuery={searchQuery} searchType={searchType} />
  );
}

export default memo(SearchResults);
