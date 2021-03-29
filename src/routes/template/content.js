import { useEffect } from "react";
import { TagsGroup } from "components/tag";
import { List, SimpleList } from "components/list";
import { Nav } from "components/nav";
import { useParams } from "react-router-dom";
import useFetchData from "hooks/useFetchData";
import useFetchStats from "hooks/useFetchStats";
import useRouterQuery from "hooks/useRouterQuery";
import { useQueueDispatch } from "store/queueContext";

const routes = [
  { label: "Latest", path: "latest" },
  { label: "Popular", path: "popular" },
];

function ChannelsList({ title, data }) {
  return (
    <>
      <h3 className="title">
        <span>{title}</span>
      </h3>
      <SimpleList dataItems={data} />
    </>
  );
}

function ContentPage({ title, category }) {
  const queueDispatch = useQueueDispatch();
  const params = useRouterQuery();
  const genre = params.get("genre");
  const { group } = useParams();
  const { isLoading, error, data } = useFetchData(category, group, genre);
  const {
    isLoading: knowledgeIsLoading,
    error: knowledgeError,
    data: knowledge,
  } = useFetchStats(category, group);

  const dataReady = !error && !isLoading && data && data.data != null;
  const knowledgeReady =
    !knowledgeError &&
    !knowledgeIsLoading &&
    knowledge &&
    knowledge.data != null;

  const showGenres =
    knowledgeReady &&
    knowledge.data["genres"] &&
    knowledge.data["genres"].length > 0;

  const showChannels =
    knowledgeReady &&
    knowledge.data["channels"] &&
    knowledge.data["channels"].length > 0;

  useEffect(() => {
    if (dataReady && data.data["streams"]) {
      queueDispatch({
        type: "setNextQueue",
        data: { items: data.data["streams"] },
      });
    }
  }, [data, dataReady, queueDispatch]);

  return (
    <div className="page">
      <Nav title={title} innerRoutes={routes} />
      <div className="content">
        <div className="content--center">
          {dataReady && (
            <List dataItems={data.data["streams"]} defaultTag={genre} />
          )}
        </div>
        <div className="content--side content--side-right">
          {showGenres && (
            <TagsGroup title={"Genres"} tags={knowledge.data["genres"]} />
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
