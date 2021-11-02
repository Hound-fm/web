import React, { memo, useRef, useState } from "react";
import { durationTrackFormat } from "util/formatDuration";
import memoize from "memoize-one";
import Thumbnail from "component/thumbnail";
import { FixedSizeList as List, areEqual } from "react-window";
import { WindowScroller } from "react-virtualized";
import useResizeObserver from "@react-hook/resize-observer";
import Button from "component/button";
import { Play, Pause } from "lucide-react";

// If list items are expensive to render,
// Consider using React.memo or shouldComponentUpdate to avoid unnecessary re-renders.
// https://reactjs.org/docs/react-api.html#reactmemo
// https://reactjs.org/docs/react-api.html#reactpurecomponent

const Row = memo(({ data, index, style }) => {
  // Data passed to List as "itemData" is available as props.data
  const { items, toggleItemActive } = data;
  const item = items[index];

  return (
    <div className="tracks-list__row" style={style}>
      <div className="row__cell">
        <div className="row__data">
          <Button icon={Play}  className={"button--play-row"}/>
          <div className="row__index">{index + 1}</div>
        </div>
        <Thumbnail className="row__thumbnail" src={item.thumbnail} />
        <div className="row__data">
          <div className="row__title text-overflow">{item.title}</div>
          <div className="row__subtitle text-overflow">
            {item.channel_title}
          </div>
        </div>
      </div>
      <div className="row__cell">
        <div className="row__metadata">
          {durationTrackFormat(item.duration)}
        </div>
      </div>
    </div>
  );
}, areEqual);

// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.

const createItemData = memoize((items, toggleItemActive) => ({
  items,
  toggleItemActive,
}));

// In this example, "items" is an Array of objects to render,
// and "toggleItemActive" is a function that updates an item's state.

export default function TrackList({ trackData, toggleItemActive }) {
  const listRef = useRef();
  const containerRef = useRef();
  const [width, setWidth] = useState(100);
  // Bundle additional data to list items using the "itemData" prop.
  // It will be accessible to item renderers as props.data.
  // Memoize this data to avoid bypassing shouldComponentUpdate().
  const itemData = createItemData(
    trackData.map((track) => track._source),
    toggleItemActive
  );
  const handleScroll = ({ scrollTop }) => {
    if (listRef && listRef.current) {
      listRef.current.scrollTo(scrollTop);
    }
  };

  useResizeObserver(containerRef, (entry) => {
    setWidth(entry.contentRect.width);
  });

  return (
    <div ref={containerRef} className="tracks-list__container">
      <WindowScroller onScroll={handleScroll}>{() => <div />}</WindowScroller>
      <List
        ref={listRef}
        width={width}
        height={trackData.length * 200}
        itemCount={trackData.length}
        itemData={itemData}
        itemSize={56}
        className="tracks-list window-scroller-override"
      >
        {Row}
      </List>
    </div>
  );
}
