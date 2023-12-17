import { TabView, TABS_MAIN } from "./tabs";

const mainTabs = new TabView("tabs-main", TABS_MAIN)

window.onload = () => {
  document.getElementById("control-panel").appendChild(mainTabs.create());
  mainTabs.open("info");
}