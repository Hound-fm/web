import { useQuery } from "react-query";

const API = "http://api.hound.fm";

function useFetchData(category, group, genre) {
  const res = useQuery([`${category}-data`, group, genre], () => {
    if (genre && genre.length > 2) {
      return fetch(
        `${API}/content/${category}?${
          group ? `group=${group}&` : ""
        }genre=${genre}`
      ).then((res) => res.json());
    }
    return fetch(
      `${API}/content/${category}?${group ? `group=${group}&` : ""}`
    ).then((res) => res.json());
  });
  return res;
}

export default useFetchData;
