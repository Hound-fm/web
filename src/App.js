import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import { ErrorNotFoundPage } from "pages/error";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import FeedPage from "pages/feed";
import QueuePage from "pages/queue";
import PlaylistPage from "pages/playlist";
import DiscoverArtistsPage from "pages/discoverArtists";
import DiscoverPodcastsPage from "pages/discoverPodcasts";
import ContextMenu from "component/contextMenu";
import usePlayerHidden from "hooks/usePlayerHidden";

function App() {
  // Compact design
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 1080px)",
  });

  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  const showMiniPlayer = useMediaQuery({
    query: "(max-width: 900px)",
  });

  // Notify player visibility to UI
  usePlayerHidden();

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
          <Route exact path="/feed" element={<FeedPage />} />
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
          <Route exact path="/community-picks" element={<PlaylistPage />} />
          <Route
            exact
            path="/featured-podcasts"
            element={<DiscoverPodcastsPage />}
          />
          <Route
            exact
            path="/featured-artists"
            element={<DiscoverArtistsPage />}
          />
          <Route path="*" element={<ErrorNotFoundPage />} />
        </Routes>
        <Player />
        <ContextMenu />
      </div>
    </Router>
  );
}

export default App;
