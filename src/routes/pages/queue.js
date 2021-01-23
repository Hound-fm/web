import { Nav } from "components/nav";
import { useQueueState } from "store/queueContext";

import Table from "components/table";

function Queue() {
  const { queue } = useQueueState();
  return (
    <div className="page">
      <Nav title={"Queue"} />
      <div className="content">
        <div className="content--center">
          <Table dataRows={queue} />
        </div>
      </div>
    </div>
  );
}

export default Queue;
