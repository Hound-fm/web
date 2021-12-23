import { useRef, useEffect } from "react";
import { useVirtual } from "react-virtual";

export default function InfiniteScroller({
  data = { pages: [] },
  fetchNextPage = () => {},
  isFetchingNextPage = false,
  hasNextPage = false,
  children = ({ virtualRow }) => virtualRow.index,
}) {
  const parentRef = useRef(null);

  const rows = data && data.pages ? data.pages.flat() : [];
  const rowVirtualizer = useVirtual({
    parentRef,
    size: hasNextPage ? rows.length + 1 : rows.length,
    windowRef: useRef(window),
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      console.info("?");
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    rows.length,
    isFetchingNextPage,
    rowVirtualizer.virtualItems,
  ]);

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
            {children(virtualRow, rows)}
          </div>
        ))}
      </div>
    </div>
  );
}
