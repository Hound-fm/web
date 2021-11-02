import { useQuery } from "react-query";

const API = "http://localhost:3333/";

const fetchSearchResults = (query, type = "") =>
  fetch(API + `search?q=${query}&type=${type}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });

export const useFetchResults = (searchQuery, searchType) =>
  useQuery(
    ["search", searchQuery, searchType],
    () => fetchSearchResults(searchQuery, searchType),
    {
      notifyOnChangeProps: ["data", "error"],
    }
  );

const fetchExploreGenre = (genre, sortBy) =>
  fetch(API + `explore?genre=${genre}${sortBy ? `&sortBy=${sortBy}` : ""}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });

export const useFetchExploreGenre = (genre, sortBy) =>
  useQuery(
    ["explore-genre", genre, sortBy],
    () => fetchExploreGenre(genre, sortBy),
    {
      notifyOnChangeProps: ["data", "error"],
    }
  );
