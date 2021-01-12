import clsx from "clsx";
import { TagsGroup } from "components/tag";
import { List, SimpleList } from "components/list";
import { Nav } from "components/nav";
import { useParams } from "react-router-dom";
import useFetchData from "hooks/useFetchData";
import useFetchKnowledge from "hooks/useFetchKnowledge";
import useRouterQuery from "hooks/useRouterQuery";

const routes = [
  { label: "Latest", path: "latest" },
  { label: "Popular", path: "popular" },
];

function ChannelsList({ title, data }) {
  return (
    <>
      <h3 className="title">
        <a href="#">{title}</a>
      </h3>
      <SimpleList dataItems={data} />
    </>
  );
}

function ContentPage({ title, category }) {
  const params = useRouterQuery();
  const tag = params.get("tag");
  const { group } = useParams();
  const { isLoading, error, data } = useFetchData(category, group, tag);
  const {
    isLoading: knowledgeIsLoading,
    error: knowledgeError,
    data: knowledge,
  } = useFetchKnowledge(category, group, tag);

  const dataReady = data && data.data != null;
  const knowledgeReady = knowledge && knowledge.data != null;

  const showGenres =
    knowledgeReady &&
    knowledge.data["genres"] &&
    knowledge.data["genres"].length > 0;

  const showTags =
    knowledgeReady &&
    knowledge.data["tags"] &&
    knowledge.data["tags"].length > 0;

  const showChannels =
    knowledgeReady &&
    knowledge.data["channels"] &&
    knowledge.data["channels"].length > 0;

  return (
    <div className="page">
      <Nav title={title} innerRoutes={routes} />
      <div className="content">
        <div className="content--center">
          <List
            dataItems={dataReady && data.data["streams"]}
            defaultTag={tag}
          />
        </div>
        <div className="content--side content--side-right">
          {showGenres && (
            <TagsGroup title={"Genres"} tags={knowledge.data["genres"]} />
          )}
          {showTags && (
            <TagsGroup title={"Tags"} tags={knowledge.data["tags"]} />
          )}

          {showChannels && (
            <ChannelsList
              title={"Channels"}
              data={knowledge.data["channels"]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentPage;
