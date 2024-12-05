import { Menu } from "./menu";

import { InfoTab } from "./tabs/info";
import { WifiTab } from "./tabs/wifi";
import { ConfigTab } from "./tabs/configuration";
import { MetricsTab } from "./tabs/metrics";
import { toast } from "./toast";
import { DangerTab } from "./tabs/danger";
import { DeviceApi } from "./api.js";

console.log("Version: alpha")

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
  configuration: ConfigTab,
  metrics: MetricsTab,
  danger: DangerTab,
};

window.addEventListener('DOMContentLoaded', async () => {
  const features =
    (await DeviceApi.features().catch(() => {
      toast.error({ caption: "Failed to load device features" });
    }).then(({ data }) => data)) ?? {};

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
    
  const mainTabs = new Menu("main-menu", tabs);
  window.features = features;
  document.getElementById("control-panel").appendChild(mainTabs.create());
  mainTabs.open("info");
})