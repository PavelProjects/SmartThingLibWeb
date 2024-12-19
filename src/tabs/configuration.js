import { DeviceApi } from "../api";
import { Components } from "../components";
import { toast } from "../toast";

const getFieldId = (name) => `config_${name}`

export const ConfigTab = {
  name: "Configuration",
  content: async () => {
    const configValues = await DeviceApi.config()
      .then(({ data }) => data ?? {})
      .catch(() => toast.error({ caption: "Failed to fetch configuration values" }));
    
    if (Object.keys(configValues).length === 0) {
      return Components.header("No config entries", "h2");
    }

    const inputsList = Object.entries(configValues).map(([name, value]) => 
      Components.input({
        id: getFieldId(name),
        label: name,
        title: `System name: ${name}`,
        value: value ?? "",
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
                Object.keys(configValues).forEach((name) => {
                  const input = document.getElementById(getFieldId(name))
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
          const values = Object.keys(configValues).reduce((acc, name) => {
            const { value } = document.getElementById(getFieldId(name)) ?? {}
            acc[name] = value
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
