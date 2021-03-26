import { useQuery } from "react-query";

const API = "https://api.hound.fm";

function useFetchData(category, group, genre) {
  const res = useQuery([`${category}-data`, group, genre], () => {
    if (genre && genre.length > 2) {
      return fetch(
        `${API}/content/${category}?${
          group ? `group=${group}&` : ""
        }genre=${genre}&page_size=20`
      ).then((res) => res.json());
    }
    return fetch(
      `${API}/content/${category}?${group ? `group=${group}&page_size=20` : ""}`
    ).then((res) => res.json());
  });
  return res;
}

export default useFetchData;
