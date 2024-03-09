import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const ConfigTab = {
  name: "Configuration",
  title: "Configuration values",
  content: async () => {
    const values = await DeviceApi.config();
    if (!values) {
      toast.error({
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch configuration values",
      });
      return;
    }
    const info = await DeviceApi.configInfo();
    if (!info) {
      toast.error({
        caption: FETCH_FAILED_CATION,
        description: "Failed to fetch configuration information",
      });
      return;
    }
    if (Object.keys(values).length === 0 || Object.keys(info).length === 0) {
      return Components.title('No config values', 'h2')
    }
    const inputsList = Components.list();
    Object.entries(info).forEach(([name, { caption, type}]) => {
      inputsList.appendChild(Components.input({
        id: name,
        label: caption,
        type: type,
        value: values[name] || ""
      }));
    });
    const controls = Components.controlsHolder();
    controls.append(
      Components.button({
        id: "config-delete",
        label: "Delete all values",
        danger: true,
        onClick: async () => {
          if (confirm("Are you sure you want to delete all configuration values?")) {
            const result = await DeviceApi.dropConfig();
            if (result) {
              toast.success({ caption: "All values removed" });
            } else {
              toast.error({
                caption: "Failed to delete configuration values"
              });
            }
          }
        }
      }),
      Components.button({
        id: "config-save",
        label: "Save",
        onClick: async () => {
          const values = {};
          Object.keys(info).forEach((key) => values[key] = document.getElementById(key).value);
          const results = await DeviceApi.saveConfig(values);
          if (results) {
            toast.success({ caption: "Configuration updated" });
          } else {
            toast.error({
              caption: "Failed to save configuration values"
            });
          }
        }
      })
    );
    const container = Components.container();
    container.append(inputsList, controls);
    return container;
  }
}