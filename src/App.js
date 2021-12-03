import Sidebar from "component/sidebar";
import Header from "component/header";
import Player from "component/player";
import HomePage from "pages/home";
import SearchPage from "pages/search";
import GenrePage from "pages/genre";
import ArtistPage from "pages/artist";
import FavoritesPage from "pages/favorites";
import PodcastPage from "pages/podcast";
import PodcastsPage from "pages/podcasts";
import QueuePage from "pages/queue";
import { ErrorNotFoundPage } from "pages/error";

import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 1200px)",
  });

  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  const showMiniPlayer = useMediaQuery({
    query: "(max-width: 900px)",
  });

  return (
    <Router>
      <div
        className={clsx(
          "app",
          isSmallScreen && "app--compact",
          isTabletOrMobile && "app--mobile",
          showMiniPlayer && "app--min-player"
        )}
      >
        <Header />
        <Sidebar />
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route exact path="/genre/:genre" element={<GenrePage />}>
            <Route exact path=":sortBy" element={<GenrePage />} />
          </Route>
          <Route exact path="/artist/:channel_id" element={<ArtistPage />}>
            <Route exact path=":sortBy" element={<ArtistPage />} />
          </Route>
          <Route exact path="/favorites" element={<FavoritesPage />}>
            <Route exact path=":favoriteType" element={<FavoritesPage />} />
          </Route>
          <Route exact path="/queue" element={<QueuePage />} />
          <Route exact path="/podcast/:channel_id" element={<PodcastPage />}>
            <Route exact path=":sortBy" element={<PodcastPage />} />
          </Route>
          <Route exact path="/podcasts" element={<PodcastsPage />}>
            <Route exact path=":sortBy" element={<PodcastsPage />} />
          </Route>
          <Route path="*" element={<ErrorNotFoundPage />} />
        </Routes>
        <Player />
      </div>
    </Router>
  );
}

export default App;
