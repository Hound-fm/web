import { useLocation } from "react-router-dom";

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

export default useRouterQuery;
