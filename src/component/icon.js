export default function Icon({ icon, ...props }) {
  const LucideIcon = icon;
  return (
    <LucideIcon className={"icon"} aria-hidden className="icon" {...props} />
  );
}
