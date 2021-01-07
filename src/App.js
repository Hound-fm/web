import { Nav, Sidebar } from "./components/nav";
import { List, SimpleList } from "./components/list";
import { useQuery } from "react-query";
import clsx from "clsx";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

import { TagLink } from "./components/tag";

function App() {
  const { isLoading, error, data } = useQuery("repoData", () =>
    fetch("http://localhost:3333/latest/music").then((res) => res.json())
  );
  const dataReady = data && data.data != null;
  const showGenres =
    dataReady && data.data["genres"] && data.data["genres"].length > 0;
  return (
    <Router>
      <div className="App dark">
        <Nav />
        <Sidebar />
        <Switch>
          <Redirect exact from="/" to="/music/latest" />
          <Redirect exact from="/music" to="/music/latest" />
          <Redirect exact from="/podcasts" to="/podcasts/latest" />
          <Redirect exact from="/audiobooks" to="/audiobooks/latest" />
        </Switch>
        <div className="page">
          <div className="content">
            <div className="content--center">
              <List dataItems={dataReady && data.data["streams"]} />
            </div>
            <div className="content--side content--side-right">
              {showGenres && (
                <>
                  <h3 className="title">
                    <a href="#">Genres</a>
                  </h3>
                  <div className="tags">
                    {data.data["genres"].map((tag) => (
                      <TagLink key={tag} tag={tag} />
                    ))}
                  </div>
                </>
              )}
              <h3 className="title">
                <a href="#">Tags</a>
              </h3>
              <div className="tags">
                {dataReady &&
                  data.data["tags"].map((tag) => (
                    <TagLink key={tag} tag={tag} />
                  ))}
              </div>
              <h3 className="title">
                <a href="#">Channels</a>
              </h3>
              <SimpleList dataItems={dataReady && data.data["channels"]} />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
