import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const InfoTab = {
  name: "Information",
  content: async () => {
    const info = await DeviceApi.info();
    if (!info) {
      toast.error({
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch system information",
      });
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

            try {
              await DeviceApi.saveName(name);
              toast.success({
                caption: "Name updated",
                description: "New device name: " + name,
              });
            } catch (error) {
              toast.error({
                caption: "Name update failed",
                description: "Failed to update device name",
              });
            } finally {
              element.classList.remove("required");
            }
          },
        }),
      }),
      Components.input({
        label: "Device type",
        value: info.type,
        disabled: true,
      }),
      Components.input({
        label: "Board",
        value: info.board,
        disabled: true,
      }),
      Components.input({
        label: "Firmware version",
        value: info.version,
        disabled: true,
        type: "number",
      }),
      Components.input({
        label: "Chip model",
        value: info.chip_model,
        disabled: true,
      }),
      Components.input({
        label: "Chip revision",
        value: info.chip_revision,
        disabled: true,
      }),
    );
    return div;
  },
};
