import Search from "component/search";
import Sidebar from "component/sidebar";
import Header from "component/header";
import Player from "component/player";
import HomePage from "pages/home";
import SearchPage from "pages/search";
import GenrePage from "pages/genre";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 1200px)",
  });

  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  return (
    <Router>
      <div
        className={clsx(
          "app",
          isSmallScreen && "app--compact",
          isTabletOrMobile && "app--mobile"
        )}
      >
        <Header />
        <Sidebar />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/search">
            <SearchPage />
          </Route>
          <Route exact path="/genre/:genre/:sortBy?">
            <GenrePage />
          </Route>
        </Switch>
        <Player />
      </div>
    </Router>
  );
}

export default App;
