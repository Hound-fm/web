import { useQuery } from "react-query";

const API = "https://api.hound.fm/";

const fetchSearchResults = (query, type = "") =>
  fetch(API + `search?q=${query}&type=${type}`).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  });

export const useFetchResults = (searchQuery, searchType) =>
  useQuery(["search", searchQuery, searchType], () =>
    fetchSearchResults(searchQuery, searchType)
  );

const fetchExploreGenre = (genre, sortBy) =>
  fetch(
    API + `explore?genre=${genre}${sortBy ? `&sortBy=${sortBy}` : ""}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  });

export const useFetchExploreGenre = (genre, sortBy) =>
  useQuery(["explore-genre", genre, sortBy], () =>
    fetchExploreGenre(genre, sortBy)
  );

const fetchExploreChannel = (channel_id, sortBy) =>
  fetch(
    API + `explore?channel_id=${channel_id}${sortBy ? `&sortBy=${sortBy}` : ""}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  });

export const useFetchExploreChannel = (channel_id, sortBy) =>
  useQuery(["explore-channel", channel_id, sortBy], () =>
    fetchExploreChannel(channel_id, sortBy)
  );

const fetchExplorePodcasts = (sortBy) =>
  fetch(
    API + `explore?type=podcast_episode${sortBy ? `&sortBy=${sortBy}` : ""}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  });

export const useFetchExplorePodcasts = (sortBy) =>
  useQuery(["explore-channel", sortBy], () => fetchExplorePodcasts(sortBy));

const fetchResolve = (resolveData) =>
  fetch(API + `resolve`, {
    // Adding method type
    method: "POST",
    // Adding body or contents to send
    body: JSON.stringify(resolveData),
    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  });

export const useFetchResolve = (resolveData) =>
  useQuery(["resolve-ids", resolveData], () => fetchResolve(resolveData));
