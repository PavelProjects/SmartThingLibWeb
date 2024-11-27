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
    
    const inputsList = Object.entries(info).map(([name, { caption, type }]) => 
      Components.input({
        id: name,
        label: `${caption} [${name}]`,
        title: `System name: ${name}\nValue type: ${type}`,
        type: type === 'boolean' ? 'checkbox' : type,
        value: values[name] || "",
      })
    );
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
              .then(() => {
                toast.success({ caption: "All values removed" })
                Object.keys(info).forEach((name) => {
                  const input = document.getElementById(name)
                  if (input) {
                    input.value = ""
                    input.checked = false
                  }
                })
              })
              .catch(() => toast.error({ caption: "Failed to delete configuration values" }));
          }
        },
      }),
      Components.button({
        id: "config-save",
        label: "Save",
        onClick: async () => {
          const values = Object.keys(info).reduce((acc, key) => {
            const { type, value, checked } = document.getElementById(key)
            acc[key] = type === 'checkbox' ? checked : value
            return acc
          }, {});
          await DeviceApi.saveConfig(values)
            .then(() => toast.success({ caption: "Configuration updated" }))
            .catch(() => toast.error({ caption: "Failed to save configuration values" }));
        },
      }),
    );
    const container = Components.container();
    const inputsContainer = Components.list();
    inputsContainer.append(...inputsList);
    container.append(inputsContainer, controls);
    container.style.padding = "2px";
    return container;
  },
};
