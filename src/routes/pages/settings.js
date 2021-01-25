import { Nav } from "components/nav";
import Icon from "@mdi/react";
import { useEffect } from "react";
import { useRadioState, Radio, RadioGroup } from "reakit/Radio";
import { useSettingsDispatch, useSettingsState } from "store/settingsContext";
import { mdiRadioboxBlank, mdiRadioboxMarked } from "@mdi/js";

function ThemeRadio({ label, active }) {
  return (
    <div className="theme-radio">
      <div className={`theme-radio__preview ${label}`}>
        <div className={"theme-radio__preview__thumbnail"} />
        <div className={"theme-radio__preview__data"}>
          <div className={"theme-radio__preview__title"} />
          <div className={"theme-radio__preview__subtitle"} />
        </div>
      </div>
      <div className="theme-radio__label">
        <Icon
          path={active ? mdiRadioboxMarked : mdiRadioboxBlank}
          className={"theme-radio__icon"}
        />
        <span>{label}</span>
      </div>
    </div>
  );
}

function ThemeSelector() {
  const { theme } = useSettingsState();
  const radio = useRadioState({ state: theme });
  const settingsDispatch = useSettingsDispatch();

  useEffect(() => {
    if (radio.state) {
      settingsDispatch({
        type: "updateSettings",
        data: { theme: radio.state },
      });
    }
  }, [radio.state, settingsDispatch]);

  return (
    <RadioGroup {...radio} aria-label="fruits" className={"theme-options"}>
      <label className={"radio"}>
        <Radio {...radio} value="light" />
        <ThemeRadio label={"Light"} active={radio.state === "light"} />
      </label>
      <label className={"radio"}>
        <Radio {...radio} value="dark" />
        <ThemeRadio label={"Dark"} active={radio.state === "dark"} />
      </label>
    </RadioGroup>
  );
}

function Settings() {
  return (
    <div className="page">
      <Nav title={"Settings"} />
      <div className="content">
        <div className="content--center">
          <section>
            <h3>Apparence</h3>
            <p> Choose your theme preferences.</p>
            <ThemeSelector />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;
