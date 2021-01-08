import { useQuery } from "react-query";

function useFetchData(category, tag) {
  const res = useQuery([`${category}-data`, { tag }], () => {
    if (tag && tag.length > 3) {
      return fetch(
        `http://localhost:3333/latest/${category}?tag=${tag}`
      ).then((res) => res.json());
    }
    return fetch(`http://localhost:3333/latest/${category}`).then((res) =>
      res.json()
    );
  });
  return res;
}

export default useFetchData;
