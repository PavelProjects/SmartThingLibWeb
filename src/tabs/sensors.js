import { DeviceApi } from "../api";
import { Components } from "../components";
import { Menu } from "../menu";

export const SensorsTab = {
  name: "Sensors",
  content: async () => {
    const sensors = await DeviceApi.sensors();
    if (!sensors || Object.keys(sensors).length === 0) {
      return Components.header("No sensors configured", "h2");
    }
    const types = await DeviceApi.sensorsTypes() ?? {};
    const menuItems = Object.entries(sensors).reduce(
      (acc, [sensor, value]) => {
        acc["sensors-menu-" + sensor] = {
          name: `${sensor}: ${value}`,
          title: `Sensor type: ${types[sensor]}`,
          content: async () => {
            if (
              window.features?.hooks === undefined ||
              window.features?.hooks == true
            ) {
              const { HooksView } = await import('./hooks.js')
              return new HooksView({
                id: "cb_view_" + sensor,
                observable: {
                  type: "sensor",
                  name: sensor,
                },
              }).create();
            } else {
              return Components.header(
                "Hooks feature disabled in this build",
                "h2",
              );
            }
          },
        };
        return acc;
      },
      {},
    );
    return new Menu("sensors-menu", menuItems).create();
  },
};
