import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function getLocationId({ pathname, search, hash }) {
  return pathname + (search ? "?" + search : "") + (hash ? "#" + hash : "");
}

export default function useLocationBlocker() {
  const history = useHistory();
  useEffect(
    () => {
      history.block((location, action) => {
        const updated =
          action !== "PUSH" ||
          getLocationId(location) !== getLocationId(history.location);
        return updated;
      });
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
}
