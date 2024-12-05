import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { Menu } from "../menu";
import { toast } from "../toast.js";

export const SensorsTab = {
  name: "Sensors",
  content: async () => {
    const { data } = await DeviceApi.sensors()
      .catch(() => toast.error({ caption: FETCH_FAILED_CATION }));

    if (!data || Object.keys(data).length === 0) {
      return Components.header("No sensors configured", "h2");
    }

    const menuItems = data.reduce(
      (acc, { name, value, type }) => {
        acc["sensors-menu-" + name] = {
          name: `${name}: ${value}`,
          title: `Type: ${type}`,
          content: async () => {
            if (
              window.features?.hooks === undefined ||
              window.features?.hooks == true
            ) {
              const { HooksView } = await import('./hooks.js')
              return new HooksView({
                id: "cb_view_" + name,
                observable: { type, name },
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
