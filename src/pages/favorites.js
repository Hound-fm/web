import { useEffect, useState } from "react";
import Page from "component/page";
import TrackList from "component/trackList";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
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
  const favorites = appState.favorites.attach(Downgraded).get();
  const { favoriteType } = useParams();
  return favoriteType ? (
    <FavoritesList favoriteType={favoriteType} favorites={favorites} />
  ) : (
    <FavoritesPreview favorites={favorites} />
  );
}
