import Icon from "./icon";
import useDebounce from "hooks/useDebounce";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { formatSearchQuery, getResultType } from "util/core";
import { useHistory, useLocation } from "react-router-dom";

export default function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const initQuery = new URLSearchParams(location.search).get("q") || "";
  const [queryText, setQueryText] = useState(initQuery);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleType = (event) => {
    setQueryText(event.target.value);
  };

  // Clear input
  useEffect(() => {
    if (!location.search) {
      setQueryText("");
    }
  }, [location.search, setQueryText]);

  useDebounce(
    () => {
      const urlParams = new URLSearchParams(location.search);
      const prevQueryText = urlParams.get("q") || "";
      const prevSearch = formatSearchQuery(prevQueryText);
      const search = formatSearchQuery(queryText);

      if (search !== prevSearch) {
        history.push({ search });
      }
    },
    [queryText, history.push, location.search, formatSearchQuery],
    750
  );

  return (
    <form role="search" className="search" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search..."
        value={queryText}
        onChange={handleType}
      />
      <Icon icon={Search} className={"input__icon"} size={"1em"} />
    </form>
  );
}
