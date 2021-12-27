import Page from "component/page";

export default function LoadingPage() {
  return (
    <Page>
      <div className={"empty-state"}>
        <div className="loading">
          <div />
          <div />
          <div />
        </div>
      </div>
    </Page>
  );
}
