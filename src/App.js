import clsx from "clsx";
//import Routes from 'components/routes'
import { Sidebar } from "components/nav";
import { List, SimpleList } from "components/list";
import { useQuery } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { TagLink } from "components/tag";

import Player from "./components/player";
import Routes from "routes";

function App() {
  const { isLoading, error, data } = useQuery("repoData", () =>
    fetch("http://localhost:3333/latest/music").then((res) => res.json())
  );
  const dataReady = data && data.data != null;
  const showGenres =
    dataReady && data.data["genres"] && data.data["genres"].length > 0;
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes />
      </div>
      <Player />
    </Router>
  );
}

export default App;
