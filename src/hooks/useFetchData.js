import { useQuery } from "react-query";

function useFetchData(category, group, tag) {
  const res = useQuery([`${category}-data`, group, tag], () => {
    if (tag && tag.length > 3) {
      return fetch(
        `http://localhost:3333/latest/${category}?${
          group ? `group=${group}&` : ""
        }tag=${tag}`
      ).then((res) => res.json());
    }
    return fetch(
      `http://localhost:3333/latest/${category}?${
        group ? `group=${group}&` : ""
      }`
    ).then((res) => res.json());
  });
  return res;
}

export default useFetchData;
