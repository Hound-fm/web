import Link from "component/link";
import { Card } from "component/card";
import { getColumnCount } from "util/core";
import { useState, useRef, useEffect, useLayoutEffect, memo } from "react";
import useResizeObserver from "@react-hook/resize-observer";

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
            "/images/" +
            metadata.label.toLowerCase() +
            ".jpg";
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
            circularThumbnail={gridType === "artist"}
          />
        );
      })}
    </div>
  );
});

const useSize = (target) => {
  const [size, setSize] = useState();

  useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect());
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

const CardsGridRow = memo(
  ({ title, queueTitle, rowType, rowsData, onResize }) => {
    const gridRef = useRef(null);
    const size = useSize(gridRef);
    const [columnCount, setColumnCount] = useState(rowsData.hits.length);
    const [cardsData, setCardsData] = useState(rowsData.hits);

    useEffect(() => {
      setColumnCount((prevColumnCount) => {
        const nextColumnCount = getColumnCount(gridRef.current);
        if (prevColumnCount !== nextColumnCount) {
          return nextColumnCount;
        }
        return prevColumnCount;
      });
    }, [setColumnCount, size]);

    useEffect(() => {
      onResize(columnCount);
    }, [onResize, columnCount]);

    useEffect(() => {
      setCardsData(rowsData.hits.slice(0, columnCount));
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
              "/images/" +
              metadata.label.toLowerCase() +
              ".jpg";
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
              circularThumbnail={rowType === "artist"}
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
        <div className="section__header">
          <div className="section__header-info">
            {title && <h2 className="section__title">{title}</h2>}
            {description && (
              <p className="section__description">{description}</p>
            )}
          </div>
        </div>
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
  }) => {
    const { hits, total } = collectionData;
    const [overflowed, setOverflowed] = useState(false);
    const showLink =
      overflowed || (collectionLink && total && total.value > hits.length);

    const onResize = (columnCount) => {
      if (hits && hits.length) {
        setOverflowed(columnCount < hits.length);
      }
    };

    return (
      <div className={"collection"}>
        <div className="section__header">
          <div className="section__header-info">
            {title && <h2 className="section__title">{title}</h2>}
            {description && (
              <p className="section__description">{description}</p>
            )}
          </div>
          <div className="section__header-actions">
            {showLink && <Link to={collectionLink}>See All</Link>}
          </div>
        </div>
        {collectionType && collectionData && (
          <CardsGridRow
            queueTitle={queueTitle}
            title={title}
            rowType={collectionType}
            rowsData={collectionData}
            onResize={onResize}
          />
        )}
      </div>
    );
  }
);
