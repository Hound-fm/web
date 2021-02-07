const STREAM_API = "https://cdn.lbryplayer.xyz/api/";
const STREAM_API_VERSION = 4;

export const getRedirectLink = (id) => `https://lbry.tv/$/search?q=${id}`;

export const getReportLink = (id) => `https://lbry.com/dmca/${id}`;

export const getStreamLink = ({ name, id }, download) => {
  const downloadQuery = download ? "?download=true" : "";
  return (
    STREAM_API +
    `v${STREAM_API_VERSION}/` +
    `streams/free/${name}/${id}/test` +
    downloadQuery
  );
};
