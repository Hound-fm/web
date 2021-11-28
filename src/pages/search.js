import Page from "component/page";
import SectionHeader from "component/sectionHeader";
import SearchResults from "component/searchResults";
import { Card, CategoryCard } from "component/card";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";

const categories = [
  { title: "podcasts", color: "209, 48, 79" },
  { title: "instrumental", color: "153,77,68" },
  { title: "electronic", color: "61, 16, 135" },
  { title: "rock", color: "160, 59, 58" },
  { title: "house", color: "46, 102, 174" },
  { title: "hip hop", color: "182, 80, 94" },
  { title: "techno", color: "8, 77, 146" },
  { title: "ambient", color: "96, 76, 153" },
  { title: "beat", color: "64, 80, 95" },
  { title: "trap", color: "99, 55, 79" },
  { title: "chill", color: "76, 18, 111" },
  { title: "reggae", color: "187, 106, 45" },
  { title: "jungle", color: "116, 63, 46" },
  { title: "edm", color: "9, 143, 82" },
  { title: "industrial", color: "228, 170, 7" },
  { title: "psychedelic", color: "48, 123, 113" },
  { title: "pop", color: "100, 81, 159" },
  { title: "folk", color: "98, 115, 61" },
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
  const collectionType = "Podcast";
  const title = "Browse all";
  const description = "";
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
