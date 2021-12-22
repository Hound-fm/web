import { useRef } from "react";
import { useVirtual } from "react-virtual";

export default function InfiniteScroller({
  rows = [],
  children = ({ virtualRow }) => virtualRow.index,
}) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtual({
    parentRef,
    size: rows.length,
    windowRef: useRef(window),
  });

  return (
    <div ref={parentRef} style={{ width: `100%` }}>
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.key}
            ref={virtualRow.measureRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {children(rows, rows[virtualRow.index], virtualRow)}
          </div>
        ))}
      </div>
    </div>
  );
}
