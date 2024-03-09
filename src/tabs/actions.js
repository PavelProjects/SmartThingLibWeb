import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const ActionsTab = {
  name: "Actions",
  title: "Actions list",
  content: async () => {
    const actions = await DeviceApi.actions();
    if (!actions) {
      toast.error({
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch device actions"
      });
      return;
    }
    const div = Components.list();
    Object.entries(actions).forEach(([action, caption]) => {
      div.appendChild(Components.button({
        id: "action_" + action,
        label: caption,
        labelElement: "h1",
        onClick: async () => {
          const result = await DeviceApi.execAction(action);
          if (result) {
            toast.success({
              caption: "Done",
              description: `Action "${caption}" performed successfully`
            })
          } else {
            toast.error({
              caption: "Action failed",
              description: `Failed to perform action "${caption}"`
            })
          }
        }
      }));
    });
    return div;
  }
}