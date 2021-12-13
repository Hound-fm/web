import React, { useState, useEffect, useMemo } from "react";
import {
  useMenuState,
  Menu as BaseMenu,
  MenuItem,
  MenuButton,
  MenuSeparator,
} from "reakit/Menu";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { MenuRight } from "component/customIcons";
import Icon from "component/icon";
import useIsFavorite from "hooks/useFavorite";
import { globalContextMenuState } from "store";
import { useState as useHookState, Downgraded } from "@hookstate/core";

import { WEB_DOMAIN } from "constants.js";

const Menu = React.forwardRef(
  ({ disclosure, menuItems, menuProps, className, ...props }, ref) => {
    const menu = useMenuState({ modal: false });
    const contextMenuState = useHookState(globalContextMenuState);
    const isSubmenu = className === "contextsubmenu";
    const position = contextMenuState.position.attach(Downgraded).value;
    const targetData = contextMenuState.targetData.attach(Downgraded).value;
    const syncHide = contextMenuState.syncHide.attach(Downgraded).value;
    const [, setSize] = useState({ width: 0, height: 0 });
    // Use negative value to hide first time:
    // Prevents flickering glitch
    const [pos, setPosition] = useState({ x: -1000, y: -1000 });

    let menuStyles = menu.unstable_popoverStyles;

    if (!isSubmenu) {
      // Override menu position based on cursor cordinates
      menuStyles = {
        ...menu.unstable_popoverStyles,
        top: 0,
        left: 0,
        transform: pos
          ? `translate3d(${pos.x || 0}px, ${pos.y || 0}px, 0px)`
          : null,
      };
    }

    const fixPosition = (width, height, lastPosition) => {
      const collisionRight = lastPosition.x + width;
      const collisionBottom = lastPosition.y + height;
      let newPosition = lastPosition;

      if (collisionRight > window.innerWidth) {
        newPosition.x = lastPosition.x - width;
      }
      if (collisionBottom > window.innerHeight) {
        newPosition.y = lastPosition.y - height;
      }

      return newPosition;
    };

    // Toggle context menu visibility and upadte position
    useEffect(() => {
      if (!isSubmenu && position.x && position.y && targetData) {
        // Open contextmenu
        menu.setVisible(true);
        contextMenuState.syncHide.set(false);
      } else if (!isSubmenu && !targetData) {
        // Close contextmenu
        contextMenuState.syncHide.set(true);
      }
      // eslint-disable-next-line
    }, [position, targetData, isSubmenu]);

    // Close menu
    useEffect(() => {
      if (menu.visible && syncHide && !isSubmenu) {
        menu.hide();
      }
      // eslint-disable-next-line
    }, [menu.visible, syncHide, isSubmenu]);

    // Clear context menu adta
    useEffect(() => {
      if (!menu.visible && !isSubmenu) {
        contextMenuState.targetData.set(null);
      }
      // eslint-disable-next-line
    }, [menu.visible, isSubmenu]);

    // Fix overlap position
    useEffect(() => {
      if (position && !isSubmenu && menu.unstable_popoverRef.current) {
        setSize((prevSize) => {
          const popover = menu.unstable_popoverRef.current;
          const width = popover.offsetWidth || prevSize.width;
          const height = popover.offsetHeight || prevSize.height;
          if (width && height) {
            const newPosition = fixPosition(width, height, position);
            setPosition(newPosition);
          }
          return { width, height };
        });
      }
    }, [
      position,
      isSubmenu,
      setPosition,
      setSize,
      menu.visible,
      menu.unstable_popoverRef,
    ]);

    const handleSelfContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <>
        {disclosure && (
          <MenuButton ref={ref} {...menu} {...props} {...disclosure.props}>
            {(disclosureProps) =>
              React.cloneElement(disclosure, disclosureProps)
            }
          </MenuButton>
        )}
        <BaseMenu
          {...menu}
          unstable_popoverStyles={menuStyles}
          {...menuProps}
          onContextMenu={handleSelfContextMenu}
          className={clsx("contextmenu", className)}
        >
          {menuItems.map((item, i) => {
            if (!item) return null;
            if (item.type === MenuSeparator) {
              return React.cloneElement(item, {
                ...menu,
                key: item.key || i,
                ...item.props,
              });
            }

            return (
              <MenuItem {...menu} {...item.props} key={item.key || i}>
                {(itemProps) => React.cloneElement(item, itemProps)}
              </MenuItem>
            );
          })}
        </BaseMenu>
      </>
    );
  }
);

const CONTEXT_TYPE_MAPPINGS = {
  artist: "artist",
  music_recording: "song",
  podcast_series: "podcast",
  podcast_episode: "episode",
};

function ContextMenu() {
  const navigate = useNavigate();
  const contextMenuState = useHookState(globalContextMenuState);
  const targetData = contextMenuState.targetData.attach(Downgraded).value;

  const contextType = useMemo(() => {
    if (targetData) {
      if (targetData.stream_type) {
        return CONTEXT_TYPE_MAPPINGS[targetData.stream_type];
      } else if (targetData.channel_type) {
        return CONTEXT_TYPE_MAPPINGS[targetData.channel_type];
      }
      return null;
    }
    return null;
  }, [targetData]);

  const { isFavorite, toggleFavorite } = useIsFavorite(
    targetData && targetData.id,
    targetData && (targetData.stream_type || targetData.channel_type)
  );

  // Actions

  const close = () => {
    contextMenuState.syncHide.set(true);
  };

  const handleFavorite = () => {
    close();
    toggleFavorite();
  };

  const goToChannelPage = () => {
    close();
    const id = targetData && targetData.channel_id;
    const channelType = targetData && targetData.channel_type;
    const pages = { artist: "artist", podcast_series: "podcast" };
    if (id && channelType) {
      navigate(`/${pages[channelType]}/${id}`);
    }
  };

  const reportContent = () => {
    close();
    const id = targetData && targetData.id;
    if (id) {
      window.open(`https://lbry.com/dmca/${id}`, "_blank");
    }
  };

  const openInDesktop = async (e) => {
    close();
    const url = targetData && targetData.url;
    if (url) {
      window.open("lbry://" + url, "_top");
    }
  };

  const openInOdysee = async (e) => {
    close();
    let url = targetData && targetData.url;
    if (url) {
      window.open(WEB_DOMAIN + "/" + url, "_blank");
    }
  };

  const copyURI = async (e) => {
    close();
    try {
      let url = targetData && targetData.url;
      if (url) {
        await navigator.clipboard.writeText("lbry://" + url);
      }
    } catch (error) {}
  };

  const copyWebLink = async (e) => {
    close();
    try {
      let url = targetData && targetData.url;
      if (url) {
        await navigator.clipboard.writeText(WEB_DOMAIN + "/" + url);
      }
    } catch (error) {}
  };

  useEffect(() => {
    // Global context menu handler
    const handleGlobalContextMenu = (e) => {
      if (e.target) {
        if (e.target.tagName !== "INPUT") {
          e.preventDefault();
        }
      }
      close();
    };
    document.addEventListener("contextmenu", handleGlobalContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleGlobalContextMenu);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Menu
      menuProps={{ "aria-label": "Custom menu" }}
      menuItems={[
        <button onClick={handleFavorite}>
          {!isFavorite ? "Add to favorites" : "Remove from favorites"}
        </button>,
        contextType === "song" ? (
          <button onClick={goToChannelPage}>{"Go to artist page"}</button>
        ) : null,
        contextType === "episode" ? (
          <button onClick={goToChannelPage}>{"Go to podcast page"}</button>
        ) : null,
        <MenuSeparator />,
        <Menu
          className={"contextsubmenu"}
          menuProps={{ "aria-label": "Sub Menu" }}
          disclosure={
            <button className="contextsubmenu__disclosure">
              <span>Share</span>
              <Icon icon={MenuRight} className={"icon button__icon"} />
            </button>
          }
          menuItems={[
            <button onClick={copyURI}>Copy URI</button>,
            <button onClick={copyWebLink}>Copy web link</button>,
          ]}
        />,
        <MenuSeparator />,
        <button onClick={openInOdysee}>{"Open in odysee"}</button>,
        <button onClick={openInDesktop}>{"Open in desktop"}</button>,
        <MenuSeparator />,
        contextType && (
          <button onClick={reportContent}>{`Report ${contextType}`}</button>
        ),
      ]}
    />
  );
}

export default ContextMenu;
