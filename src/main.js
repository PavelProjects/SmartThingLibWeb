import { Menu } from "./menu";

import { InfoTab } from "./tabs/info";
import { WifiTab } from "./tabs/wifi";
import { ActionsTab } from "./tabs/actions";
import { SensorsTab } from "./tabs/sensors";
import { StatesTab } from "./tabs/states";
import { ConfigTab } from "./tabs/configuration";
import { MetricsTab } from "./tabs/metrics";

const mainTabs = new Menu("menu-main", {
  "info": InfoTab,
  "wifi": WifiTab,
  "actions": ActionsTab,
  "sensors": SensorsTab,
  "states": StatesTab,
  "configuration": ConfigTab,
  "metrics": MetricsTab,
})

window.onload = () => {
  document.getElementById("control-panel").appendChild(mainTabs.create());
  mainTabs.open("info");
}