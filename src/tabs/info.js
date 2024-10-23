import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const InfoTab = {
  name: "Information",
  content: async () => {
    const info = await DeviceApi.info()
      .then(({ data }) => data)
      .catch(() => toast.error({ 
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch system information"
      }));
    if (!info) {
      return;
    }
    document.title = `SmartThing ${info.name}(${info.type})`;
    const div = Components.list();
    div.append(
      Components.input({
        id: "device-name",
        label: "Device name",
        value: info.name || "",
        slot: Components.button({
          id: "save-device-name",
          label: "save",
          onClick: async () => {
            const element = document.getElementById("device-name");
            const name = element.value;
            if (!name || name.length === 0) {
              element.classList.add("required");
              toast.error({
                caption: "Device name can't be empty!",
              });
              return;
            }

            await DeviceApi.saveName(name)
              .then(() => toast.success({
                caption: "Name updated",
                description: "New device name: " + name,
              }))
              .catch(() => toast.error({
                caption: "Name update failed",
                description: "Failed to update device name",
              }))
              .finally(() => element.classList.remove("required"));
          },
        }),
      }),
      Components.input({
        label: "Device type",
        value: info.type,
        disabled: true,
      }),
      Components.input({
        label: "Ip",
        value: info.ip,
        disabled: true,
      }),
      Components.input({
        label: "Board",
        value: info.board,
        disabled: true,
      }),
      Components.input({
        label: "SmartThing version",
        value: info.smtVersion,
        disabled: true,
      }),
    );
    if (info.version) {
      div.append(
        Components.input({
          label: "Firmware version",
          value: info.version,
          disabled: true,
        })
      )
    }
    div.style.padding = "2px";
    return div;
  },
};
