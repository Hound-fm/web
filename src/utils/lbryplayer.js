const BASE_API = "https://cdn.lbryplayer.xyz/api/";
const VERSION = 4;
const ROOT_URL = BASE_API + `v${VERSION}/`;

export const getStreamLink = ({ name, id }, download) => {
  const downloadQuery = download ? "?download=true" : "";
  return ROOT_URL + `streams/free/${name}/${id}/test` + downloadQuery;
};
