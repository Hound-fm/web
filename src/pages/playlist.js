import { useEffect, useState } from "react";
import Page from "component/page";
import LoadingPage from "pages/loading";
import { ErrorAPIPage } from "pages/error";
import TrackList from "component/trackList";
import { useFetchFeature } from "api";

export default function PlaylistPage() {
  const [resultsData, setResultsData] = useState(null);
  const { data, status, isLoading, isError } = useFetchFeature();

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      const res = data.data;
      const songs = res.music_recording;
      if (songs && songs.hits && songs.hits.length) {
        setResultsData(songs.hits);
      }
    }
  }, [data, status, setResultsData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  return (
    <Page>
      {resultsData && (
        <TrackList
          title={`Community picks`}
          trackData={resultsData}
          queueTitle={`Community picks`}
        />
      )}
    </Page>
  );
}
