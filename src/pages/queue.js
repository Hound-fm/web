import Page from "component/page";
import TrackList from "component/trackList";
import { globalPlayerState } from "store";
import { useState as useHookState } from "@hookstate/core";
import { useQueueSlice } from "hooks/useQueue";

export default function Queue() {
  const playerState = useHookState(globalPlayerState);
  // Use downgraded pluging to interact with array
  const queueIndex = playerState.queueIndex.value;
  const queueTitle = playerState.queueTitle.value;

  const { next, current } = useQueueSlice();

  return (
    <Page title={"Queue"}>
      {current && (
        <TrackList
          description={"Now playing"}
          startIndex={queueIndex}
          trackData={current}
        />
      )}
      {next && (
        <TrackList
          startIndex={queueIndex + 1}
          trackData={next}
          description={
            <>
              <span>Next from:</span>
              <span>{" " + queueTitle}</span>
            </>
          }
        />
      )}
    </Page>
  );
}
