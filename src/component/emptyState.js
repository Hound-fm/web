import { memo } from "react";

function EmptyState({ title, subtitle }) {
  return (
    <div className={"empty-state"}>
      {title && <h1 className={"empty-state__title"}>{title}</h1>}
      {subtitle && <p className={"empty-state__message"}>{subtitle}</p>}
    </div>
  );
}

export default memo(EmptyState);
