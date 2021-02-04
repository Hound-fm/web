import { useQuery } from "react-query";

const API = `http://api.hound.fm/knowledge`;

function useFetchKnowledge(category, group) {
  const res = useQuery([`${category}-knowledge`], () => {
    return fetch(
      `${API}/${category}?${group ? `group=${group}&` : ""}`
    ).then((res) => res.json());
  });

  return res;
}

export default useFetchKnowledge;
