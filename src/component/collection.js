import SectionHeader from "component/sectionHeader";
import { Card } from "component/card";
import { getColumnCount } from "util/core";
import { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import useSize from "hooks/useSize";

const CardsGrid = memo(({ gridData, gridType }) => {
  return (
    <div className="cards--grid">
      {gridData.map((data, index) => {
        const metadata = data._source;
        metadata.id = data._id;

        let subtitle = metadata.channel_title;
        if (metadata.channel_type) {
          if (metadata.channel_type === "artist") {
            subtitle = "Artist";
          }
          if (metadata.channel_type === "podcast_series") {
            subtitle = "Podcast";
          }
        }
        if (metadata.stream_type) {
          subtitle = metadata.channel_title;
        }
        if (metadata.label) {
          subtitle = "Genre";
          metadata.rawThumbnail =
            "/images/" + metadata.label.toLowerCase() + ".jpg";
        }
        return (
          <Card
            key={`${data._id}-${index}`}
            id={data._id}
            index={index}
            metadata={metadata}
            title={metadata.label || metadata.title || metadata.channel_title}
            subtitle={subtitle}
            thumbnail={metadata.thumbnail}
            rawThumbnail={metadata.rawThumbnail}
          />
        );
      })}
    </div>
  );
});

const CardsGridRow = memo(
  ({ title, queueTitle, rowType, rowsData, onResize }) => {
    const gridRef = useRef(null);
    const { width } = useSize(gridRef);
    const [columnCount, setColumnCount] = useState(0);
    const [cardsData, setCardsData] = useState([]);

    useEffect(() => {
      if (width && gridRef.current) {
        setColumnCount((prevColumnCount) => {
          const nextColumnCount = getColumnCount(gridRef.current);
          if (nextColumnCount && prevColumnCount !== nextColumnCount) {
            return nextColumnCount;
          }
          return prevColumnCount;
        });
      }
    }, [setColumnCount, width]);

    useEffect(() => {
      if (columnCount) {
        onResize(columnCount);
      }
    }, [onResize, columnCount]);

    useEffect(() => {
      if (columnCount && rowsData && rowsData.length) {
        setCardsData(rowsData.slice(0, columnCount));
      }
    }, [rowsData, columnCount, setCardsData]);

    return (
      <div className="cards--grid-row" ref={gridRef}>
        {cardsData.map((data, index) => {
          const metadata = data._source;
          metadata.id = data._id;

          let subtitle = metadata.channel_title;
          if (metadata.channel_type) {
            if (metadata.channel_type === "artist") {
              subtitle = "Artist";
            }
            if (metadata.channel_type === "podcast_series") {
              subtitle = "Podcast";
            }
          }
          if (metadata.stream_type) {
            subtitle = metadata.channel_title;
          }
          if (metadata.label) {
            subtitle = "Genre";
            metadata.rawThumbnail =
              "/images/" + metadata.label.toLowerCase() + ".jpg";
          }
          return (
            <Card
              key={`${title}-${data._id}-${index}`}
              id={data._id}
              index={index}
              metadata={metadata}
              title={metadata.label || metadata.title || metadata.channel_title}
              queueTitle={queueTitle}
              queueData={queueTitle ? rowsData : null}
              subtitle={subtitle}
              thumbnail={metadata.thumbnail}
              rawThumbnail={metadata.rawThumbnail}
            />
          );
        })}
      </div>
    );
  }
);

export const CollectionGrid = memo(
  ({ title, description, collectionType = "artist", collectionData = [] }) => {
    return (
      <div className={"collection"}>
        {(title || description) && (
          <SectionHeader title={title} description={description} />
        )}
        {collectionType && collectionData && (
          <CardsGrid gridType={collectionType} gridData={collectionData} />
        )}
      </div>
    );
  }
);

export const CollectionPreviewRow = memo(
  ({
    title,
    queueTitle,
    description,
    collectionLink = "/search",
    collectionType = "artist",
    collectionData = { total: { value: 0 }, hits: [] },
    maxItems = 10,
  }) => {
    const { hits, total } = collectionData;
    const [overflowed, setOverflowed] = useState(false);
    const showLink = useMemo(
      () =>
        overflowed || (collectionLink && total && total.value > hits.length),
      [overflowed, collectionLink, total, hits]
    );
    const rowsData = useMemo(() => {
      if (collectionData && collectionData.hits) {
        return collectionData.hits.slice(0, maxItems);
      } else {
        return [];
      }
    }, [collectionData, maxItems]);

    const onResize = useCallback(
      (columnCount) => {
        if (hits && hits.length) {
          setOverflowed(columnCount < hits.length);
        }
      },
      [hits, setOverflowed]
    );

    return (
      <div className={"collection"}>
        <SectionHeader
          title={title}
          description={description}
          expandLink={showLink ? collectionLink : null}
        />
        {collectionType && rowsData.length && (
          <CardsGridRow
            queueTitle={queueTitle}
            title={title}
            rowType={collectionType}
            rowsData={rowsData}
            onResize={onResize}
          />
        )}
      </div>
    );
  }
);
