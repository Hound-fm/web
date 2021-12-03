import { useEffect, useState } from "react";
import Page from "component/page";
import PageHeader from "component/pageHeader";
import LoadingPage from "pages/loading";
import { ErrorNotFoundPage, ErrorAPIPage } from "pages/error";
import TrackList from "component/trackList";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import Button from "component/button";
import FavoriteButton from "component/favoriteButton";
import { useMediaQuery } from "react-responsive";
import { useLocation, useParams } from "react-router-dom";
import { useFetchExploreChannel } from "api";
import { ExternalLink, Rss, Link2, Flag, MoreHorizontal } from "lucide-react";
import { CollectionGrid, CollectionPreviewRow } from "component/collection";

const COLLECTION_TYPES_MAPPINGS = ["Latest", "Popular"];
const SORT_TYPES_MAPPINGS = ["latest", "popular"];

function ArtistPreview({ channel_id }) {
  const [resultsData, setResultsData] = useState({});
  const { data, status, isError, isLoading } =
    useFetchExploreChannel(channel_id);
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

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

  return (
    <Page>
      {channelData && (
        <PageHeader
          title={channelData.channel_title}
          thumbnail={channelData.thumbnail}
          circularThumbnail={true}
        >
          <div className={"header__actions"}>
            <FavoriteButton
              id={channelData.id}
              favoriteType={channelData.channel_type}
              className={"button--favorite button--header"}
            />

            <Button icon={Rss} className={"button--header"} />
          </div>
        </PageHeader>
      )}
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
  const { data, status, isError, isLoading } = useFetchExploreChannel(
    channel_id,
    sortBy
  );
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

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorAPIPage />;
  }

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

  if (sortBy) {
    if (sortBy != "latest" && sortBy != "popular") {
      return <ErrorNotFoundPage />;
    }
  }

  return sortBy ? (
    <ArtistList channel_id={channel_id} sortBy={sortBy} />
  ) : (
    <ArtistPreview channel_id={channel_id} />
  );
}
