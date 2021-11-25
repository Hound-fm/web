import { useRef, useState, useEffect } from "react";
import { clamp } from "util/core";
import { useState as useHookState, none, Downgraded } from "@hookstate/core";
import { globalAppState } from "store";

export default function useFavorite(id, favoriteType) {
  const appState = useHookState(globalAppState);
  const favorites =
    appState.favorites[favoriteType].attach(Downgraded).get() || [];
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    if (id && favoriteType) {
      if (favorites.length && favorites.includes(id)) {
        // Remove from favorites (delete)
        const index = favorites.findIndex((favorite) => favorite === id);
        appState.favorites[favoriteType].set((prev) => {
          if (prev && prev.splice) {
            prev.splice(index, 1);
          }
          return prev;
        });
      } else {
        // Add to favorites (append)
        appState.favorites[favoriteType].set((prev) => {
          if (prev && prev.splice) {
            prev.splice(0, 0, id);
          }
          return prev;
        });
      }
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
