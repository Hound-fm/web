export default function Page(props) {
  const { title } = props;
  return (
    <main className="page">
      {title && <h1 className="page__title">{title}</h1>}
      {props.children}
    </main>
  );
}
