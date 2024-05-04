import { Menu } from "./menu";

import { InfoTab } from "./tabs/info";
import { WifiTab } from "./tabs/wifi";
import { ActionsTab } from "./tabs/actions";
import { SensorsTab } from "./tabs/sensors";
import { StatesTab } from "./tabs/states";
import { ConfigTab } from "./tabs/configuration";
import { MetricsTab } from "./tabs/metrics";
import { DeviceApi } from "./api";
import { toast } from "./toast";

const defaultTabs = {
  "info": InfoTab,
  "wifi": WifiTab,
  "actions": ActionsTab,
  "sensors": SensorsTab,
  "states": StatesTab,
  "configuration": ConfigTab,
  "metrics": MetricsTab,
}

window.onload = async () => {
  const features = await DeviceApi.features().catch((e) => {
    console.log("Failed to load features", e);
    toast.error({ caption: "Failed to load device features" })
  }) ?? {};
  const mainTabs = new Menu("menu-main", Object.entries(defaultTabs).reduce((acc, [key, value]) => {
    if (features[key] === undefined || features[key] === true) {
      acc[key] = value;
    }
    return acc;
  }, {}));
  window.features = features
  document.getElementById("control-panel").appendChild(mainTabs.create());
  mainTabs.open("info");
}