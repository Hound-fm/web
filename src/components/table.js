import { memo } from "react";
import { durationTrackFormat } from "utils/format";
import Thumbnail from "components/thumbnail";
import { Button } from "components/button";
import { useQueueDispatch } from "store/queueContext";

import {
  mdiShare,
  mdiShareVariant,
  mdiCreation,
  mdiAntenna,
  mdiPlay,
  mdiArrowDownBold,
  mdiStar,
  mdiDotsVertical,
  mdiCardsHeart,
} from "@mdi/js";

const TableRow = memo(({ rowData, index }) => {
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
      </div>
    </div>
  );
});

const Table = ({ dataRows }) => {
  return (
    <div className={"table"}>
      {dataRows &&
        dataRows.length > 0 &&
        dataRows.map((row, index) => (
          <TableRow key={index} rowData={row} index={index} />
        ))}
    </div>
  );
};

export default Table;
