import { useState as useHookState } from "@hookstate/core";
import { globalContextMenuState } from "store";

const useContextMenu = (data) => {
  const contextMenuState = useHookState(globalContextMenuState);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (data && data.id && (data.stream_type || data.channel_type)) {
      contextMenuState.targetData.set(data);
      contextMenuState.position.set({ x: e.clientX, y: e.clientY });
    } else {
      // Hide contextmenu if there is no enough data
      contextMenuState.targetData.set(null);
      contextMenuState.syncHide.set(false);
    }
  };

  return handleContextMenu;
};

export default useContextMenu;
