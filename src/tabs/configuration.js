import { DeviceApi } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

export const ConfigTab = {
  name: "Configuration",
  content: async () => {
    const info = await DeviceApi.configInfo()
      .then(({ data }) => data)
      .catch(() => toast.error({ caption: "Failed to fetch configuration information" }));
    if (!info) {
      return;
    }
    if (Object.keys(info).length === 0) {
      return Components.header("No config entries", "h2");
    }
    const values = await DeviceApi.config()
      .then(({ data }) => data ?? {})
      .catch(() => toast.error({ caption: "Failed to fetch configuration values" }));
    
    const inputsList = Components.list();
    Object.entries(info).forEach(([name, { caption, type }]) => {
      inputsList.appendChild(
        Components.input({
          id: name,
          label: `${caption} [${name}]`,
          title: `System name: ${name}\nValue type: ${type}`,
          type: type,
          value: values[name] || "",
        }),
      );
    });
    const controls = Components.controlsHolder();
    controls.append(
      Components.button({
        id: "config-delete",
        label: "Delete all values",
        danger: true,
        onClick: async () => {
          if (
            confirm("Are you sure you want to delete all configuration values?")
          ) {
            await DeviceApi.dropConfig()
              .then(() => toast.success({ caption: "All values removed" }))
              .catch(() => toast.error({ caption: "Failed to delete configuration values" }));
          }
        },
      }),
      Components.button({
        id: "config-save",
        label: "Save",
        onClick: async () => {
          const values = {};
          Object.keys(info).forEach(
            (key) => (values[key] = document.getElementById(key).value),
          );
          await DeviceApi.saveConfig(values)
            .then(() => toast.success({ caption: "Configuration updated" }))
            .catch(() => toast.error({ caption: "Failed to save configuration values" }));
        },
      }),
    );
    const container = Components.container();
    container.append(inputsList, controls);
    container.style.padding = "2px";
    return container;
  },
};
