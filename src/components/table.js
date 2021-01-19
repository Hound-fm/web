import { memo, useCallback } from "react";
import { durationTrackFormat } from "utils/format";
import Thumbnail from "components/thumbnail";
import { Button, ButtonMenu } from "components/button";
import { useQueueDispatch } from "store/queueContext";
import { copyToClipboard } from "utils/clipboard";
import { getStreamLink, getReportLink, getRedirectLink } from "utils/lbry";

import {
  mdiShare,
  mdiShareVariant,
  mdiCreation,
  mdiAntenna,
  mdiPlay,
  mdiArrowDownBold,
  mdiStar,
  mdiDotsHorizontal,
  mdiCardsHeart,
} from "@mdi/js";

const RowMenuButton = ({ queueItem, queueIndex }) => {
  const queueDispatch = useQueueDispatch();

  const addToQueue = () => {
    queueDispatch({ type: "addToQueue", data: queueItem });
  };

  const removeFromQueue = () => {
    queueDispatch({ type: "removeFromQueue", data: queueIndex });
  };

  const copyId = useCallback(() => {
    copyToClipboard(queueItem.id);
  }, [queueItem.id]);

  const reportLink = getReportLink(queueItem.id);

  const items = [
    { title: "Copy Id", id: "item-0", action: copyId },
    { title: "Add To Queue", id: "item-1", action: addToQueue },
    { title: "Remove From Queue", id: "item-2", action: removeFromQueue },
    { title: "Report content", id: "item-3", externalLink: reportLink },
  ];
  return (
    <ButtonMenu
      type={"icon"}
      items={items}
      className={"button--menu"}
      icon={mdiDotsHorizontal}
    />
  );
};

const TableRow = ({ rowData, index }) => {
  const queueDispatch = useQueueDispatch();
  const setTrack = () => {
    queueDispatch({ type: "setTrack", data: index });
  };

  return (
    <div className={"table__row"}>
      <div className={"table__cell"}>
        <div className={"table__cell__data fixed-width--small"}>
          <div className={"table__cell__subtitle numeric track-index"}>
            {index + 1}
          </div>
          <Button type={"icon-overlay"} icon={mdiPlay} onClick={setTrack} />
        </div>
        <Thumbnail src={rowData.thumbnail_url} className={"thumbnail--row"} />
        <div className={"table__cell__data"}>
          <div className={"table__cell__title"}>{rowData.title}</div>
          <div className={"table__cell__subtitle"}>
            {rowData.publisher_title}
          </div>
        </div>
      </div>
      <div className={"table__cell"}>
        <div className={"table__cell_data"}>
          <div className={"table__cell__subtitle"}>
            <Button type={"icon"} icon={mdiArrowDownBold} />
          </div>
        </div>
        <div className={"table__cell__data fixed-width"}>
          <div className={"table__cell__subtitle numeric"}>
            {durationTrackFormat(rowData.audio_duration)}
          </div>
        </div>
        <div className={"table__cell__subtitle"}>
          <RowMenuButton queueItem={rowData} queueIndex={index} />
        </div>
      </div>
    </div>
  );
};

const Table = ({ dataRows }) => {
  return (
    <div className={"table"}>
      {dataRows &&
        dataRows.length > 0 &&
        dataRows.map((row, index) => (
          <TableRow key={row.id + index} rowData={row} index={index} />
        ))}
    </div>
  );
};

export default Table;
