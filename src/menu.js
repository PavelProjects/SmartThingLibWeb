import { DeviceApi } from "./api";
import { CallbackView, CallbacksView } from "./callbacks";
import { Components, Icons } from "./components";
import { toast } from "./toast";

const FETCH_FAILED_CATION = "Something gone wrong";

export class Menu {
  selected = {}

  constructor(id, menuItems) {
    this.id = id;
    this.menuItems = menuItems;
  }

  create() {
    const panel = document.createElement("div");
    panel.classList.add("menu-panel");

    this.viewDiv = document.createElement("div");
    this.viewDiv.classList.add("menu-items", "list", "bordered");
    this.viewDiv.id = this.id;

    Object.entries(this.menuItems).forEach(
      ([menuItem, {name}]) => {
        const h2 = document.createElement("h2");
        h2.id = menuItem;
        h2.innerHTML = name;
        h2.onclick = () => this.open(menuItem);
        this.viewDiv.appendChild(h2);
      }
    );
    
    this.contentDiv = document.createElement("div");
    this.contentDiv.classList.add("menu-item-content");
    this.contentDiv.id = this.id + "-content";

    this.loadingTitle = document.createElement("h2");
    this.loadingTitle.classList.add("title");
    this.loadingTitle.style.display = "None";
    this.loadingTitle.innerHTML = "Loading...";
    this.contentDiv.appendChild(this.loadingTitle);

    const updateIcon = Components.icon({
      id: this.id + "-update",
      icon: Icons.update,
      onClick: () => this.updateContent()
    });
    updateIcon.classList.add("update-button");
    this.contentDiv.appendChild(updateIcon);

    panel.append(this.viewDiv, this.contentDiv);
    return panel;
  }
  open(menuItemName) {
    const menuItem = document.getElementById(menuItemName);
    if (!menuItem) {
      console.error("Failed to open menuItem id=" + menuItemName + ": element not found");
      return;
    }
    if (this.selected.item) {
      this.selected.item.classList.remove("menu-selected");
      this.selected.content.style.display = "None";
    }
    let content = document.getElementById(menuItemName + "-content");
    if (!content) {
      content = this.createContent(menuItemName, true);
      this.contentDiv.appendChild(content);
    } else {
      content.style.display = "";
    }
  
    menuItem.classList.add("menu-selected");
    
    this.selected.name = menuItemName;
    this.selected.item = menuItem;
    this.selected.content = content;
  }
  updateContent() {
    if (!this.selected) {
      return;
    }
    this.selected.content.remove();
    this.selected.content = this.createContent(this.selected.name, true);
    this.contentDiv.appendChild(this.selected.content);
  }
  createContent(menuItemName, visible=false) {
    const id = menuItemName + "-content";
    const div = document.createElement("div");
    div.id = id;
    if (!visible) {
      div.style.display = "None";
    }
  
    if (this.menuItems[menuItemName].title) {
      const titleH = document.createElement("h1");
      titleH.classList.add("title");
      titleH.innerHTML = this.menuItems[menuItemName].title;
      div.appendChild(titleH);
    }

    this.loadContent(div, menuItemName);

    return div;
  }
  async loadContent(div, menuItemName) {
    try {
      this.loading(true);
      div.appendChild(await this.menuItems[menuItemName].content())
    } catch (error) {
      console.error(error);
    } finally {
      this.loading(false);
    }
  }
  loading(value) {
    this.loadingTitle.style.display = value ? "" : "None";
  }
}

export const MENU_MAIN = {
  "info": {
    name: "Information",
    title: "Device information",
    content: async () => {
      const info = await DeviceApi.getSystemInfo();
      if (!info) {
        toast.error({ 
          caption: FETCH_FAILED_CATION,
          description: "Failed to fetch system information",
        });
        return;
      }
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
              const name =element.value;
              if (!name || name.length === 0) {
                element.classList.add("required");
                toast.error({
                  caption: "Device name can't be empty!",
                })
                return;
              }
              const result = await DeviceApi.saveName(name);
              element.classList.remove("required");
              if (result) {
                toast.success({
                  caption: "Name updated",
                  description: "New device name: " + name,
                });
              } else {
                toast.error({
                  caption: "Name update failed",
                  description: "Failed to update device name",
                });
              }
            }
          })
        }),
        Components.input({
          label: "Device type",
          value: info.type,
          disabled: true
        }),
        Components.input({
          label: "Firmware version",
          value: info.version,
          disabled: true,
          type: "number"
        }),
        Components.input({
          label: "Chip model",
          value: info.chip_model,
          disabled: true
        }),
        Components.input({
          label: "Chip revision",
          value: info.chip_revision,
          disabled: true
        })
      );
      return div;
    }
  },
  "wifi": {
    name: "WiFi",
    title: "WiFi settings",
    content: async () => {
      const { settings, modes } = await DeviceApi.getWifiSettings();
      if (!settings) {
        toast.error({ 
          caption: FETCH_FAILED_CATION,
          description: "Failed to fetch WiFi settings",
        });
        return;
      }
      const list = Components.list();
      list.append(
        Components.input({
          id: "ssid",
          label: "SSID",
          value: settings.ss || "",
        }),
        Components.input({
          id: "password",
          label: "password",
          value: settings.ps || "",
        }),
        Components.combobox({
          id: "mode",
          label: "mode",
          values: modes,
          value: settings.md,
        })
      );
      const controls = Components.controlsHolder();
      controls.appendChild(Components.button({
        label: "Save and reconnect",
        onClick: async () => {
            const result = await DeviceApi.saveWifiSettings({
            ssid: document.getElementById("ssid").value || "",
            password: document.getElementById("password").value || "",
            mode: document.getElementById("mode").value || "",
          });
          if (result) {
            toast.success({
              caption: "WiFi settings updated"
            });
          } else {
            toast.error({
              caption: "Failed to update WiFi settings",
              description: "Check device logs for additional information",
            });
          }
        }
      }));
      const container = document.createElement("div");
      container.append(list, controls);
      return container;
    }
  },
  "actions": {
    name: "Actions",
    title: "Actions list",
    content: async () => {
      const actions = await DeviceApi.getActions();
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
            const result = await DeviceApi.performAction(action);
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
  },
  "sensors": {
    name: "Sensors",
    title: "Sensors values",
    content: async () => {
      const sensors = await DeviceApi.getSensors();
      if (!sensors) {
        toast.error({
          caption: FETCH_FAILED_CATION,
          description: "Failed to fetch sensors"
        })
        return;
      }
      const menuItems = Object.entries(sensors).reduce((acc, [sensor, { value, type }]) => {
        acc["sensors-menu-" + sensor] = {
          name: `${sensor} (${type}): ${value}`,
          title: "Callbacks",
          content: async () => {
            return new CallbacksView({
              id: "cb_view_" + sensor,
              observable: {
                type: "sensor",
                name: sensor,
              }
            }).create();
          }
        };
        return acc;
      }, {});
      const view = new Menu("sensors-menu", menuItems);
      return view.create();
    }
  },
  "states": {
    name: "States",
    title: "Device states values",
    content: async () => {
      const states = await DeviceApi.getStates();
      if (!states) {
        toast.error({
          caption: FETCH_FAILED_CATION,
          description: "Failed to fetch device states"
        })
        return;
      }
      const menuItems = Object.entries(states).reduce((acc, [state, value]) => {
        acc["state-menu-" + state] = {
          name: `${state}: ${value}`,
          title: "Callbacks",
          content: async () => {
            return new CallbacksView({
              id: "cb_view_" + state,
              observable: {
                type: "state",
                name: state,
              }
            }).create();
          }
        };
        return acc;
      }, {});
      const view = new Menu("states-menu", menuItems);
      return view.create();
    }
  },
  "configuration": {
    name: "Configuration",
    title: "Configuration values",
    content: async () => {
      const info = await DeviceApi.getConfigInfo();
      if (!info) {
        toast.error({
          caption: FETCH_FAILED_CATION,
          description: "Failed to fetch configuration information",
        });
        return;
      }
      const values = await DeviceApi.getConfigValues();
      if (!values) {
        toast.error({
          caption: FETCH_FAILED_CATION,
          description: "Failed to fetch configuration values",
        });
        return;
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
          labelElement: "h2",
          onClick: async () => {
            if (confirm("Are you sure you want to delete all configuration values?")) {
              const result = await DeviceApi.deleteAllConfigValues();
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
          labelElement: "h2",
          onClick: async () => {
            const values = {};
            Object.keys(info).forEach((key) => values[key] = document.getElementById(key).value);
            const results = await DeviceApi.saveConfigValues(values);
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
      const container = document.createElement("div");
      container.append(inputsList, controls);
      return container;
    }
  },
  "metrics": {
    name: "Metrics",
    title: "Device metrics",
    content: async () => {
      const metrics = await DeviceApi.getMetrics();
      if (!metrics) {
        toast.error({
          caption: FETCH_FAILED_CATION,
          description: "Failed to fetch device metrics",
        });
        return;
      }
      return Components.tree(metrics);
    }
  },
};