import Page from "component/page";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import { CategoryCard } from "component/card";
import { useLocation } from "react-router-dom";

const categories = [
  { title: "podcasts", color: "0,130,131" },
  { title: "electronic", color: "58, 60, 63" },
  { title: "edm", color: "107,39,137" },
  { title: "house", color: "46, 102, 174" },
  { title: "rock", color: "147, 46, 53" },
  { title: "industrial", color: "146,67,6" },
  { title: "techno", color: "8, 77, 146" },
  { title: "hip hop", color: "146,54,84" },
  { title: "beat", color: "64, 80, 95" },
  { title: "ambient", color: "96, 76, 153" },
  { title: "trap", color: "99, 55, 79" },
  { title: "instrumental", color: "153,77,68" },
  { title: "chill", color: "76, 18, 111" },
  { title: "metal", color: "106, 83, 66" },
  { title: "soul", color: "91, 92, 94" },
  { title: "psychedelic", color: "48, 123, 113" },
  { title: "funk", color: "217, 72, 44" },
  { title: "jazz", color: "190, 104, 69" },
  { title: "folk", color: "98, 115, 61" },
  { title: "pop", color: "131, 72, 141" },
  { title: "reggae", color: "187, 106, 45" },
];

const ExploreCategories = () => (
  <div>
    <SectionHeader title="Browse all" />
    <div className="cards--grid">
      {categories.map((categoryData, index) => (
        <CategoryCard
          key={categoryData.title}
          title={categoryData.title}
          color={categoryData.color}
        />
      ))}
    </div>
  </div>
);

export default function SearchPage() {
  const { search } = useLocation();
  const searchQuery = new URLSearchParams(search).get("q");
  const searchType = new URLSearchParams(search).get("type");
  const showResults = searchQuery && searchQuery.length;

  return (
    <Page>
      {showResults ? (
        <SearchResults searchQuery={searchQuery} searchType={searchType} />
      ) : (
        <ExploreCategories />
      )}
    </Page>
  );
}
