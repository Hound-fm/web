const LBRY_API = "https://api.lbry.com/";

// Public token not associated with a registered account
const LBRY_API_TOKEN = "3Nk17Zn6MruF1N9KkbLAKLHFgnmu377M";

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

// Internal analytics from LBRY inc:
// This is only used for "Earnings per view" and other rewards for the creators.
// Learn more about this rewards: https://lbry.com/faq/view-rewards
export const triggerViewCount = (id, cannonical_url) => {
  fetch(
    `${LBRY_API}file/view?auth_token=${LBRY_API_TOKEN}&uri=${cannonical_url}&claim_id=${id}`
  ).then((res) => {});
};
