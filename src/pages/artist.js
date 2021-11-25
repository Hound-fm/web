import { useEffect, useState } from "react";
import Page from "component/page";
import TrackList from "component/trackList";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import { useMediaQuery } from "react-responsive";
import { useLocation, useParams } from "react-router-dom";
import { useFetchExploreChannel } from "api";
import { CollectionGrid, CollectionPreviewRow } from "component/collection";

const COLLECTION_TYPES_MAPPINGS = ["Latest", "Popular"];
const SORT_TYPES_MAPPINGS = ["latest", "popular"];

function ArtistPreview({ channel_id }) {
  const [resultsData, setResultsData] = useState([]);
  const { data, status } = useFetchExploreChannel(channel_id);
  const title =
    resultsData && resultsData.channel ? resultsData.channel.channel_title : "";

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      if (data.data) {
        setResultsData(data.data);
      }
    }
  }, [data, status, setResultsData]);

  return (
    <Page title={title}>
      {resultsData && resultsData.latest && (
        <CollectionPreviewRow
          queueTitle={`${title} · Latest`}
          title={"Latest"}
          collectionType={"music_recording"}
          collectionData={resultsData.latest}
          collectionLink={`/artist/${channel_id}/latest`}
        />
      )}
      {resultsData && resultsData.popular && (
        <CollectionPreviewRow
          queueTitle={`${title} · Popular`}
          title={"Popular"}
          collectionType={"music_recording"}
          collectionData={resultsData.popular}
          collectionLink={`/artist/${channel_id}/popular`}
        />
      )}
    </Page>
  );
}

function ArtistList({ channel_id, sortBy }) {
  const [resultsData, setResultsData] = useState([]);
  const [channelData, setChannelData] = useState();
  const { data, status } = useFetchExploreChannel(channel_id, sortBy);
  const title =
    resultsData && resultsData.channel
      ? `${resultsData.channel.channel_title} · ${sortBy}`
      : "";

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      setResultsData(data.data);
    }
  }, [data, status, setResultsData]);

  return (
    <Page title={title}>
      {resultsData && resultsData[sortBy] && (
        <TrackList trackData={resultsData[sortBy].hits} queueTitle={title} />
      )}
    </Page>
  );
}

export default function ArtistPage() {
  const { channel_id, sortBy } = useParams();
  return sortBy ? (
    <ArtistList channel_id={channel_id} sortBy={sortBy} />
  ) : (
    <ArtistPreview channel_id={channel_id} />
  );
}
