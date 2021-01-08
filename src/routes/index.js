import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Music from "routes/pages/music";
import Podcasts from "routes/pages/podcasts";
import Audiobooks from "routes/pages/audiobooks";

const Redirects = () => (
  <Switch>
    <Redirect exact from="/" to="/music/latest" />
    <Redirect exact from="/music" to="/music/latest" />
    <Redirect exact from="/podcasts" to="/podcasts/latest" />
    <Redirect exact from="/audiobooks" to="/audiobooks/latest" />
  </Switch>
);

const Routes = () => {
  return (
    <>
      <Redirects />
      <Switch>
        <Route path="/music/:group">
          <Music />
        </Route>
        <Route path="/podcasts/:group">
          <Podcasts />
        </Route>
        <Route path="/audiobooks/:group">
          <Audiobooks />
        </Route>
      </Switch>
    </>
  );
};

export default Routes;
