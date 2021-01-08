import clsx from "clsx";
import { useQuery } from "react-query";
import { TagLink } from "components/tag";
import { List, SimpleList } from "components/list";
import { Nav } from "components/nav";

function Music() {
  const { isLoading, error, data } = useQuery("music-data", () =>
    fetch("http://localhost:3333/latest/music").then((res) => res.json())
  );
  const dataReady = data && data.data != null;
  const showGenres =
    dataReady && data.data["genres"] && data.data["genres"].length > 0;
  return (
    <div className="page">
      <Nav />
      <div className="content">
        <div className="content--center">
          <List dataItems={dataReady && data.data["streams"]} />
        </div>
        <div className="content--side content--side-right">
          {showGenres && (
            <>
              <h3 className="title">
                <a href="#">Genres</a>
              </h3>
              <div className="tags">
                {data.data["genres"].map((tag) => (
                  <TagLink key={tag} tag={tag} />
                ))}
              </div>
            </>
          )}
          <h3 className="title">
            <a href="#">Tags</a>
          </h3>
          <div className="tags">
            {dataReady &&
              data.data["tags"].map((tag) => <TagLink key={tag} tag={tag} />)}
          </div>
          <h3 className="title">
            <a href="#">Channels</a>
          </h3>
          <SimpleList dataItems={dataReady && data.data["channels"]} />
        </div>
      </div>
    </div>
  );
}

export default Music;
