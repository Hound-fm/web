import clsx from "clsx";
import { TagsGroup } from "components/tag";
import { List, SimpleList } from "components/list";
import { Nav } from "components/nav";
import { useParams } from "react-router-dom";
import useFetchData from "hooks/useFetchData";
import useRouterQuery from "hooks/useRouterQuery";

const routes = [
  { label: "Latest", path: "latest" },
  { label: "Popular", path: "popular" },
];

function Music() {
  const params = useRouterQuery();
  const tag = params.get("tag");
  const { group } = useParams();
  const { isLoading, error, data } = useFetchData("music", group, tag);

  const dataReady = data && data.data != null;
  const showGenres =
    dataReady && data.data["genres"] && data.data["genres"].length > 0;
  const showTags =
    dataReady && data.data["tags"] && data.data["tags"].length > 0;
  return (
    <div className="page">
      <Nav title={"Music"} innerRoutes={routes} />
      <div className="content">
        <div className="content--center">
          <List
            dataItems={dataReady && data.data["streams"]}
            defaultTag={tag}
          />
        </div>
        <div className="content--side content--side-right">
          {showGenres && (
            <TagsGroup title={"Genres"} tags={data.data["genres"]} />
          )}
          {showTags && <TagsGroup title={"Tags"} tags={data.data["tags"]} />}
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
