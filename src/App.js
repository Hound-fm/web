import { Nav, Sidebar } from "./components/nav";
import { List, SimpleList } from "./components/list";
import { useQuery } from "react-query";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";

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
                      <a key={tag} className="item-tag">
                        {tag}
                      </a>
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
                    <a key={tag} className="item-tag">
                      {tag}
                    </a>
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
