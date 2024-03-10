import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { Menu } from "../menu";
import { toast } from "../toast";
import { HooksView } from "./hooks"

export const SensorsTab = {
  name: "Sensors",
  title: "Sensors values",
  content: async () => {
    const sensors = await DeviceApi.sensors();
    if (!sensors) {
      toast.error({
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch sensors"
      })
      return;
    }
    if (Object.keys(sensors).length === 0) {
      return Components.title("No sensors configured", "h2")
    }
    const menuItems = Object.entries(sensors).reduce((acc, [sensor, { value, type }]) => {
      acc["sensors-menu-" + sensor] = {
        name: `${sensor} (${type}): ${value}`,
        title: "Hooks",
        content: async () => {
          return new HooksView({
            id: "cb_view_" + sensor,
            observable: {
              type: "sensor",
              name: sensor,
            }
          }).create();
        }
      };
      return acc;
    }, {});
    const view = new Menu("sensors-menu", menuItems);
    return view.create();
  }
}