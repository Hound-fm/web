import { FEATURE_CONTENT } from "api";
import { ResolveChannelsList } from "component/channelsList";

export default function DiscoverArtists() {
  const listProps = {
    title: "Featured artists",
    list: FEATURE_CONTENT.artist,
    channelType: "artist",
  };
  return <ResolveChannelsList {...listProps} />;
}
