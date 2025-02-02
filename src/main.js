import { Menu } from "./menu";

import { InfoTab } from "./tabs/info";
import { WifiTab } from "./tabs/wifi";
import { MetricsTab } from "./tabs/metrics";
import { toast } from "./toast";
import { DangerTab } from "./tabs/danger";
import { DeviceApi } from "./api.js";

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
  config: async () => {
    const { ConfigTab } = await import("./tabs/config.js");
    return ConfigTab
  },
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
        tabs[key] = await value().catch(() => toast.error({ caption: "failed to load tab" }))
      } else {
        tabs[key] = value
      }
    }
  }
    
  const mainTabs = new Menu("main-menu", tabs);
  window.features = features;
  const panel = document.getElementById("control-panel");
  panel.appendChild(mainTabs.create());
  mainTabs.open("info");
  panel.style.opacity = '1';
})