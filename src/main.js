import { Menu } from "./menu";

import { InfoTab } from "./tabs/info";
import { WifiTab } from "./tabs/wifi";
import { ConfigTab } from "./tabs/configuration";
import { MetricsTab } from "./tabs/metrics";
import { DeviceApi } from "./api";
import { toast } from "./toast";
import { DangerTab } from "./tabs/danger";

const defaultTabs = {
  info: InfoTab,
  wifi: WifiTab,
  actions: async () => {
    const { ActionsTab } = await import( "./tabs/actions.js")
    return ActionsTab
  },
  sensors: async () => {
    const { SensorsTab } = await import( "./tabs/sensors.js")
    return SensorsTab
  },
  states: async () => {
    const { StatesTab } = await import( "./tabs/states.js")
    return StatesTab
  },
  configuration: ConfigTab,
  metrics: MetricsTab,
  danger: DangerTab,
};

window.onload = async () => {
  const features =
    (await DeviceApi.features().catch(() => {
      toast.error({ caption: "Failed to load device features" });
    })) ?? {};

  const tabs = {}
  for (const [key, value] of Object.entries(defaultTabs)) {
    if (features[key] === undefined || features[key] === true) {
      if (typeof value === 'function') {
        tabs[key] = await value()
      } else {
        tabs[key] = value
      }
    }
  }
    
  const mainTabs = new Menu("menu-main", tabs);
  console.log(Object.entries(mainTabs.menuItems))
  window.features = features;
  document.getElementById("control-panel").appendChild(mainTabs.create());
  mainTabs.open("info");
};
