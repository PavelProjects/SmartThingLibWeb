import { TabView, TABS_MAIN } from "./tabs";

const mainTabs = new TabView("tabs-main", TABS_MAIN)

window.onload = () => {
  document.getElementById("control-panel").appendChild(mainTabs.create());
  mainTabs.open("info");
  /**
   * todo toast:
   * - add div block for them
   * - create methods, that will create toast view
   * - toast should be remove after N ms
   * 
   * loadings - show animations:
   * - add in tabs
   * - add in callback view?
   * 
   * update buttons:
   * - recreate content in tab 
   */
}