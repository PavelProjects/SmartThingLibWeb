import { DeviceApi } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const ActionsTab = {
  name: "Actions",
  content: async () => {
    const actions = await DeviceApi.actions();
    if (!actions) {
      return Components.header("No actions configured");
    }
    const div = Components.list();
    Object.entries(actions).forEach(([action, caption]) => {
      div.appendChild(
        Components.button({
          id: "action_" + action,
          label: caption,
          title: `System name: ${action}`,
          labelElement: "h1",
          onClick: async () => {
            try {
              await DeviceApi.execAction(action);
              toast.success({
                caption: "Done",
                description: `Action "${caption}" performed successfully`,
              });
            } catch (error) {
              toast.error({
                caption: "Action failed",
                description: `Failed to perform action "${caption}"`,
              });
            }
          },
        }),
      );
    });
    div.style.padding = "2px";
    return div;
  },
};
