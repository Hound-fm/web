import { Nav } from "components/nav";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Icon from "@mdi/react";
import useFetchStats from "hooks/useFetchStats";
import { mdiFire, mdiTagMultiple } from "@mdi/js";

function PopularGenre({ name }) {
  return (
    <Link to={`latest?genre=${name}`} className="card card--long">
      {" "}
      <div className={"card__title"}>{name}</div>
    </Link>
  );
}

function Genre({ name }) {
  return (
    <Link to={`latest?genre=${name}`} className="card">
      {" "}
      <div className={"card__title"}>{name}</div>
    </Link>
  );
}

function Genres({ category, categoryTitle }) {
  const [genres, setGenres] = useState({ popular: [], all: [] });
  const { data } = useFetchStats(`tags/${category}`);

  useEffect(() => {
    if (data && data.genres) {
      setGenres({
        all: [...data.genres.slice(4, data.genres.length)],
        popular: [...data.genres.slice(0, 4)],
      });
    }
  }, [data]);

  return (
    <div className="page">
      <Nav
        title={
          <span>
            {categoryTitle || category}
            <span className="slash">/</span>
            <span className="subpage">Genres</span>
          </span>
        }
      />
      <div className="content">
        <div className="content--center">
          <section>
            <h3>
              <Icon path={mdiFire} className={"title__icon title__icon--red"} />
              <span>Popular</span>
            </h3>
            <div className="row__container">
              <div className={"row-scroll"}>
                <div className={"cards cards--horizontal"}>
                  {genres &&
                    genres.popular.map((genre) => (
                      <PopularGenre key={genre.label} name={genre.label} />
                    ))}
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3>
              {" "}
              <Icon path={mdiTagMultiple} className={"title__icon"} />
              <span>All</span>
            </h3>

            <div className={"cards cards--grid"}>
              {genres &&
                genres.all.map((genre) => (
                  <Genre key={genre.label} name={genre.label} />
                ))}
            </div>
          </section>
        </div>
        <div className="content--side"></div>
      </div>
    </div>
  );
}

export default Genres;
