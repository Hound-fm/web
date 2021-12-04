import { useEffect, useState } from "react";
import { useFetchResolve } from "api";
import Page from "component/page";
import { CollectionPreviewRow } from "component/collection";
import LoadingPage from "pages/loading";
import { ErrorAPIPage } from "pages/error";

const FEATURE_CONTENT = {
  music_recording: [
    "943974dad05701664246aadd0334fb58c4835a08",
    "bf7344fe7191bc40b742bd49a60b3965d0bd3626",
    "e8381767409945de9cf5427e3fcc5bbfafebe05f",
    "0f7c47e2bd55b4816151219156576ef8d74d7d87",
    "faafa7e8dfc9f0b13987adde4cb5d5b1d5369ff2",
    "746ac2b8ce740a9edc5321dcdf3e520026747b38",
    "ae0fa08293f7a218e7453d31f8a73b59535ca0b7",
    "997c8405f0c67269ff3cab2fde588c2b21367b17",
    "1b28f78160f873b825285ff8e52fd6c1ec1a7457",
    "c75f45ce314980afe76e7475b7cb157fe83e966e",
    "b396680c8994ebd185f0974038410c66823cfa9a",
    "8976e6ee4a71d72365e1c157d622d31a32d731a1",
  ],
  artist: [
    "61ed988923c77f58e76aa8bd645b8d3453e1c9c7",
    "8ca3f96c78cbc4e36a133c62ad38b05a2b676254",
    "dc6f41ade5640711c6d8bdbea757a35067e13ea2",
    "6812e2e1488c2443ce6eb99fa396d20cd0e3d5ce",
    "f3ea3f47375be51b1d7ef48a2b27dcbc6f751965",
    "5b26f662aadef31f171a1b06ff210fb740601117",
    "f87fded10f62f5ebe5ea5e8792b97d414a98d6a4",
    "631ca9fce459f1116ae5317486c7f4af69554742",
    "f0fe6b0791e81641800ccf67624f7e7053f42879",
    "6f3449831083bc2cd2e27916720caf693e6b550d",
    "685033d346cd41af939b7098be0a7ecdda9e0100",
    "06dc91c1246d5fa7c47c72b9592ac3d93acd62d9",
    "8191b527e438e102c4b42246e38cb8cffc27f30d",
  ],
  podcast_series: [
    "fe4cfc71a4748003dd3868d51cd68db38ca8457e",
    "1da718d3b905323e597aaccac5a6b0feb276cc37",
    "1f4409e8178df3900c541527515257c89c3ea80c",
    "675dfbb1fff53d76b14db389ff3448561037d311",
    "c0aba61eb6c871b3f79cf14c30133d516d3c45b7",
    "860000c67c5cada11ab7ada4216e82b271e800db",
    "f5ce6db853d27d0992f0d1b558060b09ecb876c2",
    "98833736432fedd4933c706cbb2305fa63260b8f",
    "ec8edadbb133f21d6d2c0e0d6d685ae5d392a80a",
    "a605a1aa0b9a225dacd7dd144ee650611a466fd0",
  ],
};

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
      <CollectionPreviewRow
        title="Community Picks"
        collectionType="Music"
        collectionData={homeData.music_recording}
        description="Awesome music curated by humans"
      />
      <CollectionPreviewRow
        title="Discover Artists"
        collectionType="Artist"
        collectionData={homeData.artist}
        description="Find your next favorite artist"
      />
      <CollectionPreviewRow
        title="Top Podcasts"
        collectionType="Podcast"
        collectionData={homeData.podcast_series}
        description="Listen to some of the best shows"
      />
    </Page>
  );
}
