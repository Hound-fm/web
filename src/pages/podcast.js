import { useEffect, useState } from "react";
import Page from "component/page";
import PageHeader from "component/pageHeader";
import TrackList from "component/trackList";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import Button from "component/button";
import FavoriteButton from "component/favoriteButton";
import { useMediaQuery } from "react-responsive";
import { useLocation, useParams } from "react-router-dom";
import { useFetchExploreChannel } from "api";
import { Link, Share2 } from "lucide-react";
import { CollectionGrid, CollectionPreviewRow } from "component/collection";

const COLLECTION_TYPES_MAPPINGS = ["Latest", "Popular"];
const SORT_TYPES_MAPPINGS = ["latest", "popular"];

function PodcastPreview({ channel_id }) {
  const [resultsData, setResultsData] = useState({});
  const { data, status } = useFetchExploreChannel(channel_id);
  const channelData = resultsData ? resultsData.channel : null;
  const title = channelData ? channelData.channel_title : "";

  useEffect(() => {
    if (status == "success" && data) {
      // Process results
      if (data.data) {
        setResultsData(data.data);
      }
    }
  }, [data, status, setResultsData]);

  return (
    <Page>
      {channelData && (
        <PageHeader
          title={channelData.channel_title}
          thumbnail={channelData.thumbnail}
        >
          <div className={"header__actions"}>
            <FavoriteButton
              id={channelData.id}
              favoriteType={channelData.channel_type}
              className={"button--favorite"}
            />
          </div>
        </PageHeader>
      )}
      {resultsData && resultsData.latest && (
        <CollectionPreviewRow
          queueTitle={`${title} · Latest`}
          title={"Latest"}
          collectionType={"podcast_episode"}
          collectionData={resultsData.latest}
          collectionLink={`/podcast/${channel_id}/latest`}
        />
      )}
      {resultsData && resultsData.popular && (
        <CollectionPreviewRow
          queueTitle={`${title} · Popular`}
          title={"Popular"}
          collectionType={"podcast_episode"}
          collectionData={resultsData.popular}
          collectionLink={`/podcast/${channel_id}/popular`}
        />
      )}
    </Page>
  );
}

function PodcastList({ channel_id, sortBy }) {
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

export default function PodcastPage() {
  const { channel_id, sortBy } = useParams();
  return sortBy ? (
    <PodcastList channel_id={channel_id} sortBy={sortBy} />
  ) : (
    <PodcastPreview channel_id={channel_id} />
  );
}
