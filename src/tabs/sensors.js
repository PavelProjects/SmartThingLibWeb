import { DeviceApi } from "../api";
import { Components } from "../components";
import { Menu } from "../menu";
import { HooksView } from "./hooks";

export const SensorsTab = {
  name: "Sensors",
  content: async () => {
    const sensors = await DeviceApi.sensors();
    if (!sensors || Object.keys(sensors).length === 0) {
      return Components.title("No sensors configured", "h2");
    }
    const menuItems = Object.entries(sensors).reduce(
      (acc, [sensor, { value, type }]) => {
        acc["sensors-menu-" + sensor] = {
          name: `${sensor} (${type}): ${value}`,
          title: "Hooks",
          content: async () => {
            if (
              window.features?.hooks === undefined ||
              window.features?.hooks == true
            ) {
              return new HooksView({
                id: "cb_view_" + sensor,
                observable: {
                  type: "sensor",
                  name: sensor,
                },
              }).create();
            } else {
              return Components.title(
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
