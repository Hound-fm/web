import { useEffect, useState } from "react";
import { FEATURE_CONTENT, useFetchResolve } from "api";
import Page from "component/page";
import { CollectionPreviewRow } from "component/collection";
import LoadingPage from "pages/loading";
import { ErrorAPIPage } from "pages/error";

export default function HomePage() {
  const { data, status, isLoading, isError } = useFetchResolve(FEATURE_CONTENT);
  const [homeData, setHomeData] = useState({});

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      if (data.data) {
        setHomeData(data.data);
      }
    }
  }, [data, status, setHomeData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  return (
    <Page>
      {homeData.music_recording && (
        <CollectionPreviewRow
          title="Community picks"
          collectionType="Music"
          queueTitle="Community picks"
          collectionData={homeData.music_recording}
          collectionLink="/community-picks"
          description="Awesome music curated by humans"
        />
      )}
      {homeData.artist && (
        <CollectionPreviewRow
          title="Discover artists"
          collectionType="Artist"
          collectionData={homeData.artist}
          collectionLink="/featured-artists"
          description="Find your next favorite artist"
        />
      )}
      {homeData.podcast_series && (
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
