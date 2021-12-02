import { useEffect, useState } from "react";
import Page from "component/page";
import TrackList from "component/trackList";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import ErrorPage from "pages/error";

import { useMediaQuery } from "react-responsive";
import { useLocation, useParams } from "react-router-dom";
import { useFetchResolve } from "api";
import { useState as useHookState, none, Downgraded } from "@hookstate/core";
import { globalAppState } from "store";

import { CollectionGrid, CollectionPreviewRow } from "component/collection";

const COLLECTION_TYPES_MAPPINGS = {
  genre: "Genres",
  artist: "Artists",
  music_recording: "Songs",
  podcast_series: "Podcasts",
  podcast_episode: "Episodes",
};
const SORT_TYPES_MAPPINGS = ["latest", "popular"];

const FAVORITE_TYPES = [
  "genre",
  "artist",
  "music_recording",
  "podcast_series",
  "podcast_episode",
];

function FavoritesEmptyState() {
  return (
    <Page>
      <div className={"empty-state"}>
        <h1 className={"empty-state__title"}>No favorites yet!</h1>
        <p className={"empty-state__message"}>
          Save content by tapping the heart icon.
        </p>
      </div>
    </Page>
  );
}

function FavoritesList({ favoriteType, favorites }) {
  const fetchData = {};
  const [resultsData, setResultsData] = useState([]);
  fetchData[favoriteType] = favorites[favoriteType];
  const { data, status } = useFetchResolve(fetchData);

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      const res = data.data;
      setResultsData(res[favoriteType].hits);
    }
  }, [data, status, favoriteType, resultsData]);

  return (
    <Page title={`Favorites · ${COLLECTION_TYPES_MAPPINGS[favoriteType]}`}>
      {resultsData && (
        <TrackList
          trackData={resultsData}
          queueTitle={`Favorites · ${COLLECTION_TYPES_MAPPINGS[favoriteType]}`}
        />
      )}
    </Page>
  );
}

function FavoritesPreview({ favorites }) {
  const [favoritesData, setFavoritesData] = useState({
    artist: null,
    music_recording: null,
    podcast_series: null,
    podcast_episode: null,
  });

  const { data, status } = useFetchResolve(favorites);
  const title = "Favorites";

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      if (data.data) {
        setFavoritesData(data.data);
      }
    }
  }, [data, status, setFavoritesData]);

  return (
    <Page title={title}>
      {Object.entries(favoritesData).map(
        ([key, value], index) =>
          value &&
          value.hits &&
          value.hits.length && (
            <CollectionPreviewRow
              key={`${key}-${value.hits.length}`}
              queueTitle={`${title} · ${key}`}
              title={COLLECTION_TYPES_MAPPINGS[key]}
              collectionType={key}
              collectionData={value}
              collectionLink={`/favorites/${key}`}
            />
          )
      )}
    </Page>
  );
}

export default function FavoritesPage() {
  const appState = useHookState(globalAppState);
  const favorites = appState.favorites.attach(Downgraded).value;
  const { favoriteType } = useParams();
  const [isEmpty, setIsEmpty] = useState(null);

  useEffect(() => {
    const favoritesEntries = Object.entries(favorites);
    let empty = true;
    for (let [key, value] of favoritesEntries) {
      if (value && value.length) {
        empty = false;
        break;
      }
    }
    setIsEmpty(empty);
  }, [
    favorites,
    favorites.music_recording.length,
    favorites.podcast_episode.length,
  ]);

  if (favoriteType) {
    if (!FAVORITE_TYPES.includes(favoriteType)) {
      return <ErrorPage />;
    }
  }

  if (isEmpty) {
    return <FavoritesEmptyState />;
  } else if (isEmpty === false) {
    return favoriteType ? (
      <FavoritesList favoriteType={favoriteType} favorites={favorites} />
    ) : (
      <FavoritesPreview favorites={favorites} />
    );
  }
  return null;
}