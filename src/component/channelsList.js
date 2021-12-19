import { useEffect, useState, memo } from "react";
import Page from "component/page";
import LoadingPage from "pages/loading";
import { ErrorAPIPage } from "pages/error";
import { useFetchResolve } from "api";
import { CollectionGrid } from "component/collection";

export const RawChannelsList = memo(
  ({ title = "", channelType = "artist", list = [] }) => {
    return (
      <Page>
        <CollectionGrid
          title={title}
          collectionData={list}
          collectionType={channelType}
        />
      </Page>
    );
  }
);

export const ResolveChannelsList = memo(
  ({ title = "", channelType = "artist", list = [] }) => {
    const [resultsData, setResultsData] = useState([]);
    const { data, status, isLoading, isError } = useFetchResolve({
      [channelType]: list,
    });

    useEffect(() => {
      if (status === "success" && data) {
        // Process results
        const res = data.data;
        const channels = res[channelType];
        if (channels && channels.hits && channels.hits.length) {
          setResultsData(channels.hits);
        }
      }
    }, [data, status, setResultsData, channelType]);

    if (isLoading) {
      return <LoadingPage />;
    }

    if (isError) {
      return <ErrorAPIPage />;
    }

    return (
      <Page>
        <CollectionGrid
          title={title}
          collectionData={resultsData}
          collectionType={channelType}
        />
      </Page>
    );
  }
);
