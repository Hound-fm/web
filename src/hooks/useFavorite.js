import { useRef, useState, useEffect } from "react";
import { clamp } from "util/core";
import { useState as useHookState, none, Downgraded } from "@hookstate/core";
import { globalAppState } from "store";

export default function useFavorite(id, favoriteType) {
  const appState = useHookState(globalAppState);
  const favorites =
    appState.favorites[favoriteType].attach(Downgraded).value || [];
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    if (id && favoriteType) {
      appState.favorites[favoriteType].set((prevFavorites) => {
        if (prevFavorites.length && prevFavorites.includes(id)) {
          const index = prevFavorites.findIndex((favorite) => favorite === id);
          // Remove from favorites (delete)
          if (index > -1) {
            prevFavorites.splice(index, 1);
          }
        } else {
          // Add to favorites (append)
          prevFavorites.splice(0, 0, id);
        }
        return prevFavorites;
      });
    }
  };

  useEffect(() => {
    if (id && favoriteType) {
      if (favorites.length) {
        if (favorites.includes(id)) {
          setIsFavorite(true);
          return;
        }
      }
    }
    setIsFavorite(false);
  }, [id, favoriteType, favorites.length]);

  return { isFavorite, toggleFavorite };
}
