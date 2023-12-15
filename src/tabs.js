import { DeviceApi } from "./api";
import { createCallbackView } from "./callbacks";
import { Components } from "./components";

export class TabView {
  selectedTab = {}

  constructor(id, tabs) {
    this.id = id;
    this.tabs = tabs;
  }

  create() {
    const panel = document.createElement("div");
    panel.classList.add("tabs-panel");

    this.viewDiv = document.createElement("div");
    this.viewDiv.classList.add("tabs-items", "list");
    this.viewDiv.id = this.id;

    Object.entries(this.tabs).forEach(
      ([tab, {name}]) => {
        const h2 = document.createElement("h2");
        h2.id = tab;
        h2.innerHTML = name;
        h2.onclick = () => this.open(tab);
        this.viewDiv.appendChild(h2);
      }
    );
    
    this.contentDiv = document.createElement("div");
    this.contentDiv.classList.add("tabs-content");
    this.contentDiv.id = this.id + "_content";

    panel.append(this.viewDiv, this.contentDiv);
    return panel;
  }
  open(tabName) {
    const tab = document.getElementById(tabName);
    if (!tab) {
      console.error("Failed to open tab id=" + tabName + ": element not found");
      return;
    }
    if (this.selectedTab.tab) {
      this.selectedTab.tab.classList.remove("selected-tab");
      this.selectedTab.content.style.display = "None";
    }
    let content = document.getElementById(tabName + "_content");
    if (!content) {
      content = this.createTabContent(tabName);
      this.contentDiv.appendChild(content);
    }
  
    tab.classList.add("selected-tab");
    content.style.display = "";
    
    this.selectedTab.tab = tab;
    this.selectedTab.content = content;
  }
  createTabContent(tabName) {
    const id = tabName + "_content";
    const div = document.createElement("div");
    div.id = id;
    div.classList.add("tab-content");
    div.style.display = "None";
  
    if (this.tabs[tabName].title) {
      const titleH = document.createElement("h1");
      titleH.classList.add("title");
      titleH.innerHTML = this.tabs[tabName].title;
      div.appendChild(titleH);
    }

    this.loadContent(div, tabName);

    return div;
  }
  async loadContent(div, tabName) {
    try {
      // todo add loading
      div.appendChild(await this.tabs[tabName].content())
    } catch (error) {
      console.error(error);
    }
  }
}

export const TABS_MAIN = {
  "info": {
    name: "Information",
    title: "Device information",
    content: async () => {
      const info = await DeviceApi.getSystemInfo();
      const div = Components.list();
      div.append(
        Components.input({
          id: "name",
          label: "Device name",
          value: info.name || "",
          slot: Components.button({
            label: "save",
            onClick: () => DeviceApi.saveName(document.getElementById("name").value)
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
  "actions": {
    name: "Actions",
    title: "Device actions",
    content: async () => {
      const actions = await DeviceApi.getActions();
      const div = Components.list();
      Object.entries(actions).forEach(([action, caption]) => {
        div.appendChild(Components.button({
          id: "action_" + action,
          label: caption,
          labelElement: "h1",
          onClick: () => DeviceApi.performAction(action)
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
      const tabs = Object.entries(sensors).reduce((acc, [sensor, { value, type }]) => {
        acc[sensor] = {
          name: `${sensor} (${type}): ${value}`,
          title: "Callbacks",
          content: () => createCallbackView({
            name: sensor,
            type: "sensor",
          })
        };
        return acc;
      }, {});
      const view = new TabView("sensors", tabs);
      return view.create();
    }
  },
  "states": {
    name: "States",
    title: "Device states",
    content: async () => {
      const states = await DeviceApi.getStates();
      const tabs = Object.entries(states).reduce((acc, [state, value]) => {
        acc[state] = {
          name: `${state}: ${value}`,
          title: "Callbacks",
          content: () => createCallbackView({
            name: state,
            type: "state",
          })
        };
        return acc;
      }, {});
      console.log(tabs);
      const view = new TabView("states", tabs);
      return view.create();
    }
  },
  "configuration": {
    name: "Configuration",
    title: "Configuration",
    content: async () => {
      const info = await DeviceApi.getConfigInfo();
      const values = await DeviceApi.getConfigValues();
      const inputsList = Components.list();
      Object.entries(info).forEach(([name, { caption, type}]) => {
        inputsList.appendChild(Components.input({
          id: name,
          label: caption,
          type: type,
          value: values[name] || ""
        }));
      });
      const controls = document.createElement("div");
      controls.classList.add("controls-holder");
      controls.append(
        Components.button({
          label: "Delete all values",
          danger: true,
          labelElement: "h2",
          onClick: () => {
            if (confirm("Are you sure you want to delete all configuration values?")) {
              DeviceApi.deleteAllConfigValues();
            }
          }
        }),
        Components.button({
          label: "Save",
          labelElement: "h2",
          onClick: () => DeviceApi.saveConfigValues()
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
      return Components.tree(metrics);
    }
  },
};