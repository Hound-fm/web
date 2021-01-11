import { useQuery } from "react-query";

const API = `http://localhost:3333/knowledge`;

function useFetchKnowledge(category, group) {
  const res = useQuery([`${category}-knowledge`], () => {
    return fetch(
      `${API}/latest/${category}?${group ? `group=${group}&` : ""}`
    ).then((res) => res.json());
  });

  console.info(res.data && res.data.data);
  return res;
}

export default useFetchKnowledge;
