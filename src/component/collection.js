import Link from "component/link";
import { Card } from "component/card";
import { getColumnCount } from "util/core";
import { useState, useRef, useEffect, useCallback } from "react";
import useResizeObserver from "@react-hook/resize-observer";

function CardsGrid({ gridData, gridType }) {
  return (
    <div className="cards--grid">
      {gridData.map((data, index) => {
        const metadata = data._source;
        let subtitle = metadata.channel_title;
        if (metadata.channel_type) {
          if (metadata.channel_type == "artist") {
            subtitle = "Artist";
          }
          if (metadata.channel_type == "podcast_series") {
            subtitle = "Podcast";
          }
        }
        if (metadata.stream_type) {
          subtitle = metadata.channel_title;
        }
        if (metadata.label) {
          subtitle = "Genre";
          metadata.rawThumbnail =
            "http://localhost:3000/images/" +
            metadata.label.toLowerCase() +
            ".jpg";
        }
        return (
          <Card
            key={data._id}
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
}

function CardsGridRow({ rowType, rowsData, onResize }) {
  const gridRef = useRef(null);
  const [columnCount, setColumnCount] = useState(rowsData.hits.length);
  const [cardsData, setCardsData] = useState(rowsData.hits);
  const handleResize = useCallback(
    (e) => {
      if (gridRef.current) {
        setColumnCount((prevColumnCount) => {
          const nextColumnCount = getColumnCount(gridRef.current);
          if (prevColumnCount != nextColumnCount) {
            onResize(nextColumnCount);
            return nextColumnCount;
          }
          return prevColumnCount;
        });
      }
    },
    [getColumnCount, onResize, setColumnCount, gridRef.current]
  );

  useEffect(() => {
    if (columnCount != cardsData.length) {
      setCardsData(rowsData.hits.slice(0, columnCount));
    }
  }, [cardsData.length, rowsData.hits, columnCount, setCardsData]);

  useResizeObserver(gridRef, (entry) => {
    handleResize();
  });

  return (
    <div className="cards--grid-row" ref={gridRef}>
      {cardsData.map((data, index) => {
        const metadata = data._source;
        let subtitle = metadata.channel_title;
        if (metadata.channel_type) {
          if (metadata.channel_type == "artist") {
            subtitle = "Artist";
          }
          if (metadata.channel_type == "podcast_series") {
            subtitle = "Podcast";
          }
        }
        if (metadata.stream_type) {
          subtitle = metadata.channel_title;
        }
        if (metadata.label) {
          subtitle = "Genre";
          metadata.rawThumbnail =
            "http://localhost:3000/images/" +
            metadata.label.toLowerCase() +
            ".jpg";
        }
        return (
          <Card
            key={data._id}
            title={metadata.label || metadata.title || metadata.channel_title}
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

export function CollectionGrid({
  title,
  description,
  collectionType = "artist",
  collectionData = [],
}) {
  const { hits, total } = collectionData;

  return (
    <div className={"collection"}>
      <div className="section__header">
        <div className="section__header-info">
          {title && <h2 className="section__title">{title}</h2>}
          {description && <p className="section__description">{description}</p>}
        </div>
      </div>
      {collectionType && collectionData && (
        <CardsGrid gridType={collectionType} gridData={collectionData} />
      )}
    </div>
  );
}

export function CollectionPreviewRow({
  title,
  description,
  collectionLink = "/search",
  collectionType = "artist",
  collectionData = { total: { value: 0 }, hits: [] },
}) {
  const { hits, total } = collectionData;
  const [overflowed, setOverflowed] = useState(false);
  const showLink =
    overflowed || (collectionLink && total && total.value > hits.length);

  const onResize = useCallback(
    (columnCount) => {
      setOverflowed(columnCount < hits.length);
    },
    [hits, setOverflowed]
  );

  return (
    <div className={"collection"}>
      <div className="section__header">
        <div className="section__header-info">
          {title && <h2 className="section__title">{title}</h2>}
          {description && <p className="section__description">{description}</p>}
        </div>
        <div className="section__header-actions">
          {showLink && <Link to={collectionLink}>See All</Link>}
        </div>
      </div>
      {collectionType && collectionData && (
        <CardsGridRow
          rowType={collectionType}
          rowsData={collectionData}
          onResize={onResize}
        />
      )}
    </div>
  );
}
