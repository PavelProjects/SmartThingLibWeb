import { Components } from "./components";

const errorHeere = "";

export class Menu {
  selected = {};

  constructor(id, menuItems, placeholder) {
    this.id = id;
    this.menuItems = menuItems;
    this.placeholder = placeholder;
  }

  create() {
    const panel = document.createElement("div");
    panel.classList.add("menu-panel");

    this.viewDiv = document.createElement("div");
    this.viewDiv.classList.add("menu-items", "list", "br");
    this.viewDiv.id = this.id;

    Object.entries(this.menuItems).forEach(([item, { name, title }]) => {
      const h2 = document.createElement("h2");
      h2.id = item;
      h2.innerHTML = name;
      if (title) {
        h2.title = title;
      }
      h2.onclick = () => this.open(item);
      this.viewDiv.appendChild(h2);
    });

    this.contentDiv = document.createElement("div");
    this.contentDiv.classList.add("menu-item-content");
    this.contentDiv.id = this.id + "-content";

    this.loadingTitle = Components.header("Loading...", "h2");
    this.loadingTitle.style.display = "none";
    this.contentDiv.appendChild(this.loadingTitle);

    panel.append(this.viewDiv, this.contentDiv);
    return panel;
  }
  open(menuItemName) {
    if (this.selected?.name === menuItemName) {
      this.updateContent();
      return;
    }
    const menuItem = document.getElementById(menuItemName);
    if (!menuItem) {
      console.error(
        "Failed to open menuItem id=" + menuItemName + ": element not found",
      );
      return;
    }
    if (this.selected.item) {
      this.selected.item.classList.remove("menu-selected");
      this.selected.content.style.display = "none";
    }
    let content = document.getElementById(menuItemName + "-content");
    if (!content) {
      content = this.createContent(menuItemName);
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
    this.selected.content = this.createContent(this.selected.name);
    this.contentDiv.appendChild(this.selected.content);
  }
  createContent(menuItemName) {
    const id = menuItemName + "-content";
    const container = Components.container();
    container.id = id;
    if (this.menuItems[menuItemName].header) {
      container.appendChild(
        Components.header(this.menuItems[menuItemName].header),
      );
    }
    this.loadContent(container, menuItemName);
    return container;
  }
  async loadContent(div, menuItemName) {
    try {
      this.loading(true);
      div.appendChild(
        (await this.menuItems[menuItemName].content()) ??
          Components.container(),
      );
    } catch (error) {
      console.error(error);
    } finally {
      this.loading(false);
    }
  }
  loading(value) {
    this.loadingTitle.style.display = value ? "" : "none";
  }
}
