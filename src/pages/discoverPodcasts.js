import { FEATURE_CONTENT } from "api";
import { ResolveChannelsList } from "component/channelsList";

export default function DiscoverPodcasts() {
  const listProps = {
    title: "Featured podcasts",
    list: FEATURE_CONTENT.podcast_series,
    channelType: "podcast_series",
  };
  return <ResolveChannelsList {...listProps} />;
}
