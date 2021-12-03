import { memo } from "react";
function Icon({ icon, ...props }) {
  const LucideIcon = icon;
  return <LucideIcon className={"icon"} aria-hidden {...props} />;
}

export default memo(Icon);
