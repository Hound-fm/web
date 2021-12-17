import { useEffect, memo } from "react";
import useTitle from "hooks/useTitle";
function Page(props) {
  const { title } = props;
  const { setTitle } = useTitle();
  useEffect(() => {
    if (title) {
      setTitle(title);
    }
    // eslint-disable-next-line
  }, [title]);
  return (
    <main className="page">
      {title && <h1 className="page__title">{title}</h1>}
      {props.children}
    </main>
  );
}

export default memo(Page);
