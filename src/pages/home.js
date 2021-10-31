import Page from "component/page";
import { CollectionPreviewRow } from "component/collection";

export default function HomePage({ title }) {
  return (
    <Page title={title}>
      <CollectionPreviewRow
        title="Community Picks"
        collectionType="Music"
        description="Awesome music curated by humans"
      />
      <CollectionPreviewRow
        title="Top Podcasts"
        collectionType="Podcast"
        description="Listen to some of the best shows"
      />
      <CollectionPreviewRow
        title="Discover Artists"
        collectionType="Artist"
        description="Find your next favorite artist"
      />
    </Page>
  );
}
