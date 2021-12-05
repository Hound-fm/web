import Page from "component/page";

export default function LoadingPage() {
  return (
    <Page>
      <div className={"empty-state"}>
        <div class="loading">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </Page>
  );
}
