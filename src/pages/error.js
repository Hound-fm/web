import LogoError from "../logo_error.svg";
import Page from "component/page";

export function ErrorNotFoundPage() {
  return (
    <Page>
      <div className={"empty-state"}>
        <img alt="" src={LogoError} className={"logo"} aria-hidden />
        <h1 className={"empty-state__title"}>Woof!</h1>
        <p className={"empty-state__message"}>
          Sorry, couldn't find that page.
        </p>
      </div>
    </Page>
  );
}

export function ErrorAPIPage() {
  return (
    <Page>
      <div className={"empty-state"}>
        <img alt="" src={LogoError} className={"logo"} aria-hidden />
        <h1 className={"empty-state__title"}>Woof!</h1>
        <p className={"empty-state__message"}>
          Something went wrong, try again later.
        </p>
      </div>
    </Page>
  );
}
