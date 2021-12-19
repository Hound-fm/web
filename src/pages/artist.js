import { ErrorNotFoundPage } from "pages/error";
import { useParams } from "react-router-dom";
import { ChannelPreview, ChannelPlaylist } from "component/channel";

export default function ArtistPage() {
  const { channel_id, sortBy } = useParams();

  if (sortBy) {
    if (sortBy !== "latest" && sortBy !== "popular") {
      return <ErrorNotFoundPage />;
    }
  }

  return sortBy ? (
    <ChannelPlaylist
      channel_id={channel_id}
      sortBy={sortBy}
      channel_type={"artist"}
    />
  ) : (
    <ChannelPreview channel_id={channel_id} channel_type={"artist"} />
  );
}
