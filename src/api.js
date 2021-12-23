import { useQuery, useInfiniteQuery } from "react-query";

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

// Todo store / load from a database
const fetchFeature = () => {
  return fetch(
    "https://raw.githubusercontent.com/Hound-fm/podcatcher/main/data/collections.json"
  )
    .then((response) => {
      if (!response || !response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (!data || Object.keys(data).length <= 0) {
        throw new Error("Failed to load feature data ");
      }
      const resolveData = {
        artist: data["featured-artists"]["claims"],
        music_recording: data["community-picks"]["claims"],
        podcast_series: data["featured-podcasts"]["claims"],
      };
      return fetchResolve(resolveData);
    });
};

export const useFetchFeature = () =>
  useQuery(["feature"], () => fetchFeature(), {
    cacheTime: 30 * 60 * 1000, // 30 minutes
    keepPreviousData: true,
  });

const fetchFeed = ({ pageParam = 0 }) =>
  fetch(API + `feed?page=${pageParam}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.data) {
        const dataHits = data.data.hits;
        if (dataHits && dataHits.hits) {
          return dataHits.hits;
        }
      }
    });

export const useFetchFeed = () => {
  return useInfiniteQuery("feed", fetchFeed, {
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || !lastPage.length || lastPage.length < 25) {
        return undefined;
      }
      return pages.length <= 10 ? pages.length : undefined;
    },
  });
};
