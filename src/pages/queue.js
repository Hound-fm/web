import Page from "component/page";
import TrackList from "component/trackList";
import { globalPlayerState } from "store";
import { useState as useHookState } from "@hookstate/core";
import { useQueueSlice } from "hooks/useQueue";

function QueueEmptyState() {
  return (
    <Page>
      <div className={"empty-state"}>
        <h1 className={"empty-state__title"}>Queue is empty!</h1>
        <p className={"empty-state__message"}>
          Tap on the play button of any track.
        </p>
      </div>
    </Page>
  );
}

export default function Queue() {
  const playerState = useHookState(globalPlayerState);
  // Use downgraded pluging to interact with array
  const queueIndex = playerState.queueIndex.value;
  const queueTitle = playerState.queueTitle.value;

  const { next, current } = useQueueSlice();

  // Nothing to play
  const showEmpty = current === null;
  const showQueue = current && current.length;

  if (showEmpty) {
    return <QueueEmptyState />;
  }

  return (
    <>
      {" "}
      {showQueue && (
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
      )}
    </>
  );
}
