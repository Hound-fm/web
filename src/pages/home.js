import { useEffect, useState } from "react";
import { useFetchFeature } from "api";
import Page from "component/page";
import { CollectionPreviewRow } from "component/collection";
import LoadingPage from "pages/loading";
import { ErrorAPIPage } from "pages/error";
import useTitle from "hooks/useTitle";
import { getRandomGreetings } from "util/core";

export default function HomePage() {
  const { data, status, isLoading, isError } = useFetchFeature();
  const [homeData, setHomeData] = useState();
  const { setTitle } = useTitle();

  // Set page title
  useEffect(() => {
    setTitle(getRandomGreetings());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      console.info(data);
      if (data.data) {
        setHomeData(data.data);
      }
    }
  }, [data, status, setHomeData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (
    isError ||
    (homeData && !Object.keys(homeData).length) ||
    (data && data.error)
  ) {
    return <ErrorAPIPage />;
  }

  return (
    <Page>
      {homeData && homeData.music_recording && (
        <CollectionPreviewRow
          title="Community picks"
          collectionType="Music"
          queueTitle="Community picks"
          collectionData={homeData.music_recording}
          collectionLink="/community-picks"
          description="Awesome music curated by humans"
        />
      )}
      {homeData && homeData.artist && (
        <CollectionPreviewRow
          title="Discover artists"
          collectionType="Artist"
          collectionData={homeData.artist}
          collectionLink="/featured-artists"
          description="Find your next favorite artist"
        />
      )}
      {homeData && homeData.podcast_series && (
        <CollectionPreviewRow
          title="Top podcasts"
          collectionType="Podcast"
          collectionLink="/featured-podcasts"
          collectionData={homeData.podcast_series}
          description="Listen to some of the best shows"
        />
      )}
    </Page>
  );
}
