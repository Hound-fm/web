import Page from "component/page";
import TrackList from "component/trackList";
import { globalPlayerState } from "store";
import { useState as useHookState, Downgraded } from "@hookstate/core";
import { CollectionPreviewRow } from "component/collection";

export default function Queue(props) {
  const playerState = useHookState(globalPlayerState);
  // Use downgraded pluging to interact with array
  const queueData = playerState.queueData.attach(Downgraded).get();
  const queueTitle = playerState.queueTitle.value;

  return (
    <Page title={"Queue"}>
      {queueData && <TrackList title={queueTitle} trackData={queueData} queueTitle={queueTitle} />}
    </Page>
  );
}
