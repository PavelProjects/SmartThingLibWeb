import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const WifiTab = {
  name: "WiFi",
  content: async () => {
    const { settings, modes } = await DeviceApi.getWifi()
      .then(({ data }) => data)
      .catch(() => 
        toast.error({
          caption: FETCH_FAILED_CATION,
          description: "Failed to fetch WiFi settings",
        }));

    if (!settings) {
      return;
    }
    const list = Components.list();
    list.append(
      Components.input({
        id: "ssid",
        label: "SSID",
        value: settings.ssid || "",
      }),
      Components.input({
        id: "password",
        label: "password",
        value: settings.password || "",
        type: "password",
      }),
      Components.combobox({
        id: "mode",
        label: "mode",
        values: modes,
        value: settings.mode,
      }),
    );
    const controls = Components.controlsHolder();
    controls.appendChild(
      Components.button({
        label: "Save",
        onClick: async () => {
          DeviceApi.saveWifi({
            ssid: document.getElementById("ssid").value || "",
            password: document.getElementById("password").value || "",
            mode: document.getElementById("mode").value || "",
          }).then(() => toast.success({
            caption: "WiFi settings updated",
            description: "Restart device to apply new settings"
          })).catch(() => toast.error({
            caption: "Failed to update WiFi settings",
            description: "Check device logs for additional information",
          }))
        },
      }),
    );
    const container = Components.container();
    container.append(list, controls);
    container.style.padding = "2px";
    return container;
  },
};
