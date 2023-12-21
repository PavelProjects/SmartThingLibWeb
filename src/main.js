import { Menu, MENU_MAIN } from "./menu";

const mainTabs = new Menu("menu-main", MENU_MAIN)

window.onload = () => {
  document.getElementById("control-panel").appendChild(mainTabs.create());
  mainTabs.open("info");
}