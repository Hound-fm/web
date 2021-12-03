import LogoError from "../logo_error.svg";
import Page from "component/page";

export default function LoadingPage() {
  return (
    <Page>
      <div className={"empty-state"}>
        <div className="loader" />
      </div>
    </Page>
  );
}
