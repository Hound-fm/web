import { useEffect, useState } from "react";
import { useFetchFeature } from "api";
import { RawChannelsList } from "component/channelsList";

export default function DiscoverArtists() {
  const [listData, setListData] = useState({
    list: [],
    title: "Featured artists",
    channelType: "artist",
  });

  const { data, status } = useFetchFeature();

  useEffect(() => {
    if (status === "success" && data) {
      // Process results
      if (data.data) {
        const list = data.data["artist"];
        if (list && list.hits) {
          setListData((prev) => ({ ...prev, list: list.hits }));
        }
      }
    }
  }, [data, status, setListData]);

  return <RawChannelsList {...listData} />;
}
