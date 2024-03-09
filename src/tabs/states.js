import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { toast } from "../toast";
import { Menu } from "../menu";
import { HooksView } from "./hooks"

export const StatesTab = {
  name: "States",
  title: "Device states values",
  content: async () => {
    const states = await DeviceApi.states();
    if (!states) {
      toast.error({
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch device states"
      })
      return;
    }
    const menuItems = Object.entries(states).reduce((acc, [state, value]) => {
      acc["state-menu-" + state] = {
        name: `${state}: ${value}`,
        title: "Hooks",
        content: async () => {
          return new HooksView({
            id: "cb_view_" + state,
            observable: {
              type: "state",
              name: state,
            }
          }).create();
        }
      };
      return acc;
    }, {});
    const view = new Menu("states-menu", menuItems);
    return view.create();
  }
}