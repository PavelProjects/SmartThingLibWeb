import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { toast } from "../toast";
import { Menu } from "../menu";
import { HooksView } from "./hooks"
import { Components } from "../components";

export const StatesTab = {
  name: "States",
  title: "Device states values",
  content: async () => {
    const states = await DeviceApi.states();
    if (!states || Object.keys(states).length === 0) {
      return Components.title("No states configured", "h2")
    }
    const menuItems = Object.entries(states).reduce((acc, [state, value]) => {
      acc["state-menu-" + state] = {
        name: `${state}: ${value}`,
        title: "Hooks",
        content: async () => {
          if (window.features?.hooks === undefined || window.features?.hooks == true) {
            return new HooksView({
              id: "cb_view_" + state,
              observable: {
                type: "state",
                name: state,
              }
            }).create();
          } else {
            return Components.title("Hooks feature disabled in this build", "h2")
          }
        }
      };
      return acc;
    }, {});
    const view = new Menu("states-menu", menuItems).create();
    view.classList.add("bt");
    return view;
  }
}