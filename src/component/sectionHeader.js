import { memo } from "react";
import Link from "component/link";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "react-responsive";

function SectionHeader({ title, description, expandLink }) {
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 720px)",
  });

  return (
    <div className="section__header">
      <div className="section__header-info">
        {title && <h2 className="section__title">{title}</h2>}
        {description && <p className="section__description">{description}</p>}
      </div>
      {expandLink && (
        <div className="section__header-actions">
          <Link to={expandLink} icon={isTabletOrMobile ? ArrowRight : null}>
            {isTabletOrMobile ? null : "See All"}
          </Link>
        </div>
      )}
    </div>
  );
}

export default memo(SectionHeader);
