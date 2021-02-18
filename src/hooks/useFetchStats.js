import { useQuery } from "react-query";

const API = `https://api.hound.fm/stats`;

function useFetchStats(category, group) {
  const res = useQuery([`${category}-${group}-stats`], () => {
    return fetch(
      `${API}/${category}?${group ? `group=${group}&` : ""}`
    ).then((res) => res.json());
  });

  return res;
}

export default useFetchStats;
