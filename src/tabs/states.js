import { DeviceApi } from "../api";
import { Menu } from "../menu";
import { HooksView } from "./hooks";
import { Components } from "../components";

export const StatesTab = {
  name: "Device states",
  content: async () => {
    const states = await DeviceApi.states();
    if (!states || Object.keys(states).length === 0) {
      return Components.header("No states configured", "h2");
    }
    const menuItems = Object.entries(states).reduce((acc, [state, value]) => {
      acc["state-menu-" + state] = {
        name: `${state}: ${value}`,
        header: "Hooks",
        content: async () => {
          if (
            window.features?.hooks === undefined ||
            window.features?.hooks == true
          ) {
            return new HooksView({
              id: "cb_view_" + state,
              observable: {
                type: "state",
                name: state,
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
    }, {});
    return new Menu("states-menu", menuItems).create();
  },
};
