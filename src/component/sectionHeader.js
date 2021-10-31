import Link from "component/link";

export default function SectionHeader({ title, description, expandLink }) {
  return (
    <div className="section__header">
      <div className="section__header-info">
        {title && <h2 className="section__title">{title}</h2>}
        {description && <p className="section__description">{description}</p>}
      </div>
      {expandLink && (
        <div className="section__header-actions">
          <Link to={expandLink}>See All</Link>
        </div>
      )}
    </div>
  );
}
