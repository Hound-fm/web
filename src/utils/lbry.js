const STREAM_BASE_API = "https://cdn.lbryplayer.xyz/api/";
const VERSION = 4;

export const getStreamLink = ({ name, id }, download) => {
  const downloadQuery = download ? "?download=true" : "";
  return (
    STREAM_BASE_API +
    `v${VERSION}/` +
    `streams/free/${name}/${id}/test` +
    downloadQuery
  );
};

export const getRedirectLink = (id) => `https://lbry.tv/$/search?q=${id}`;

export const getReportLink = (id) => `https://lbry.com/dmca/${id}`;
