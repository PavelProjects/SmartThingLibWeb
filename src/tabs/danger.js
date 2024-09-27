import { DeviceApi } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const DangerTab = {
  name: "Danger zone",
  content: async () => {
    const div = Components.list();
    div.appendChild(Components.header("Please, be careful with this actions!"));
    div.append(
      Components.button({
        id: "restart",
        label: "Restart device",
        labelElement: "h1",
        danger: true,
        onClick: () => {
          if (!confirm("Are you sure you want to restart device right now?")) {
            return;
          }
          DeviceApi.restart();
          toast.success({
            caption: "Restarting",
            description: "Device is restarting, please wait",
          });
        },
      }),
      Components.button({
        id: "wipe",
        label: "Wipe device settings",
        labelElement: "h1",
        danger: true,
        onClick: () => {
          if (
            !confirm("THIS ACTIONS WILL DELETE ALL SETTINGS FROM DEVICE!") ||
            !confirm("THERE IS NOY TO RESTORE THEM AFTER THIS ACTION!") ||
            !confirm("THIS IS LAST CONFIRMATION")
          ) {
            return;
          }
          DeviceApi.wipe();
          toast.success({
            caption: "Settings wiped",
            description: "Device is gonna restart now, please wait",
          });
        },
      }),
    );
    div.style.padding = "2px";
    return div;
  },
};
