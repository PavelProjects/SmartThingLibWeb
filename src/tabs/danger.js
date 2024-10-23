import { DeviceApi, FETCH_FAILED_CATION } from "../api";
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
          DeviceApi.restart()
            .then(() =>
              toast.success({
                caption: "Restarting",
                description: "Device is restarting, please wait",
              })
            )
            .catch(() => toast.error({ caption: FETCH_FAILED_CATION }));
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
          DeviceApi.wipe()
            .then(() =>
              toast.success({
                caption: "Settings wiped",
                description: "Device is gonna restart now, please wait",
              })
            )
            .catch(() => toast.error({ caption: FETCH_FAILED_CATION }));
        },
      }),
    );
    div.style.padding = "2px";
    return div;
  },
};
