import { useQuery } from "react-query";

export const FEATURE_CONTENT = {
  music_recording: [
    "2e7e47315f4afcd8fe547874ab311ecec33d78f0",
    "91803366353193d27298c7c72ff09b36c131163e",
    "e2b0a0191f4e239c996f160ef07c452621691a61",
    "bf7344fe7191bc40b742bd49a60b3965d0bd3626",
    "943974dad05701664246aadd0334fb58c4835a08",
    "144fd24cade94b0779d42d830514d53efe31f34a",
    "16523b6ca4c7743fd7835d096412bc22904be4be",
    "4a695269dc132022ef8b5bed717f646c60d6c6e4",
    "676cfd68c3276430b96d73c89546f9ef43ab484a",
    "e8381767409945de9cf5427e3fcc5bbfafebe05f",
    "0f7c47e2bd55b4816151219156576ef8d74d7d87",
    "faafa7e8dfc9f0b13987adde4cb5d5b1d5369ff2",
    "746ac2b8ce740a9edc5321dcdf3e520026747b38",
    "ae0fa08293f7a218e7453d31f8a73b59535ca0b7",
    "997c8405f0c67269ff3cab2fde588c2b21367b17",
    "1b28f78160f873b825285ff8e52fd6c1ec1a7457",
    "c75f45ce314980afe76e7475b7cb157fe83e966e",
    "b396680c8994ebd185f0974038410c66823cfa9a",
    "8976e6ee4a71d72365e1c157d622d31a32d731a1",
  ],
  artist: [
    "61ed988923c77f58e76aa8bd645b8d3453e1c9c7",
    "8ca3f96c78cbc4e36a133c62ad38b05a2b676254",
    "dc6f41ade5640711c6d8bdbea757a35067e13ea2",
    "6812e2e1488c2443ce6eb99fa396d20cd0e3d5ce",
    "f0fe6b0791e81641800ccf67624f7e7053f42879",
    "f87fded10f62f5ebe5ea5e8792b97d414a98d6a4",
    "6f3449831083bc2cd2e27916720caf693e6b550d",
    "06dc91c1246d5fa7c47c72b9592ac3d93acd62d9",
    "a47bef89f2a6ead3a26affbfb53923e687a9f326",
    "5b26f662aadef31f171a1b06ff210fb740601117",
    "3046c2e97f2f7be54fb699a08431a6d35864b7b6",
    "f3ea3f47375be51b1d7ef48a2b27dcbc6f751965",
    "685033d346cd41af939b7098be0a7ecdda9e0100",
    "039ada4d62c41308643f7945957ee914419d3ce4",
    "62d37ab718a598a7faf29729bb1d8e3bead2c6ea",
    "8b0049a7ead4e50d83b9b73fb34d019c6d257d0e",
    "289502d52dce8c3955cf38f0626b0aced6f033f0",
    "2042a6b4a3a48b5bbccde4805e4d8d84ad4efce1",
    "8191b527e438e102c4b42246e38cb8cffc27f30d",
    "631ca9fce459f1116ae5317486c7f4af69554742",
  ],
  podcast_series: [
    "fe4cfc71a4748003dd3868d51cd68db38ca8457e",
    "1da718d3b905323e597aaccac5a6b0feb276cc37",
    "8092ac3335d2716af7ddf59c0bd2c7464acd2055",
    "1f4409e8178df3900c541527515257c89c3ea80c",
    "c0aba61eb6c871b3f79cf14c30133d516d3c45b7",
    "ffe6c7b74c849b215b567635de0c45ed6dfe03a1",
    "675dfbb1fff53d76b14db389ff3448561037d311",
    "f5ce6db853d27d0992f0d1b558060b09ecb876c2",
    "98833736432fedd4933c706cbb2305fa63260b8f",
    "6cdab7eef134ef78c327e30b22783404d5ef1227",
    "1cdcfeb4c8fb5fe7a0cee8d94502fe25a0d5ef1a",
    "3bbca94b0ca64fdcc2e20eb113a39675b6106427",
    "860000c67c5cada11ab7ada4216e82b271e800db",
    "e5e9ed95a09abf573a59da4de82b2957d4771c3e",
    "eaf488c9e84b8402cbc8bfef4b19c9fcdf58d2ed",
    "7b6f7517f6b816827d076fa0eaad550aa315a4e7",
    "ec8edadbb133f21d6d2c0e0d6d685ae5d392a80a",
    "a605a1aa0b9a225dacd7dd144ee650611a466fd0",
  ],
};

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
