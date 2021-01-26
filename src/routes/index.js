import { Route, Switch, Redirect } from "react-router-dom";

import Music from "routes/pages/music";
import Podcasts from "routes/pages/podcasts";
import Audiobooks from "routes/pages/audiobooks";
import Queue from "routes/pages/queue";
import Settings from "routes/pages/settings";

import useLocationBlocker from "hooks/useLocationBlocker";

const Routes = () => {
  useLocationBlocker();
  return (
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

      <Route path="/queue">
        <Queue />
      </Route>

      <Route path="/settings">
        <Settings />
      </Route>

      <Redirect exact from="/" to="/music/latest" />
      <Redirect exact from="/music" to="/music/latest" />
      <Redirect exact from="/podcasts" to="/podcasts/latest" />
      <Redirect exact from="/audiobooks" to="/audiobooks/latest" />
    </Switch>
  );
};

export default Routes;
