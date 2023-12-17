import { DeviceApi } from "./api";
import { Components, Icons, fillCombobox } from "./components";
import { toast } from "./toast";

function normalizeSystemName(value) {
  if (typeof value != "string" || value.length == 0) {
    return '';
  }
  return value.split('').reduce(
      (acc, ch) => {
          if (ch === '_') {
              acc += ' ';
          } else if (ch === ch.toUpperCase()) {
              acc += " " + ch.toLowerCase();
          } else {
              acc += ch;
          }
          return acc;
      }, "");
}

const SYSTEM_FIELDS = ["id", "type", "readonly"]
function isDefaultField(key) {
  return SYSTEM_FIELDS.includes(key);
}

export class CallbackView {
  constructor({id="", callback, template, observable, parent}) {
    this.id = id;
    this.callback = callback;
    this.template = template;
    this.observable = observable;
    this.parent = parent;

    this.fields = Object.entries(this.callback)
      .filter(([key, _]) => !isDefaultField(key))
      .reverse();

      this.controls = {
      "delete": Components.icon({ 
        icon: Icons.trash,
        onClick: () => this.delete()
      }),
      "edit": Components.icon({
        icon: Icons.pencil,
        onClick: () => this.edit()
      }),
      "cancel": Components.icon({ 
        icon: Icons.cross,
        onClick: () => this.cancel(),
        visible: false,
      }),
      "save": Components.icon({ 
        icon: Icons.save,
        onClick: () => this.save(),
        visible: false,
      }),
    };
  }
  create() {
    const exists = document.getElementById(this.id);
    if (this.id && exists) {
      return exists;
    }
    const container = Components.container({ bordered: true });
    container.id = this.id;

    const header = document.createElement("div");
    header.classList.add("callback-header");

    const title = document.createElement("h3");
    const { id, caption, type } = this.callback;
    title.innerHTML = `[${id}] ${caption || normalizeSystemName(type)}`
    title.classList.add("title", "callback-title");

    const controls = document.createElement("div");
    controls.classList.add("callback-view-controls");
    Object.values(this.controls).forEach((v) => controls.appendChild(v));

    header.append(title, controls);

    const list = Components.list();
    this.fields.forEach(([field, value]) => {
      const { required } = this.template[field] || false;
      const props = {
        id: `cb_${id}_${field}`,
        label: normalizeSystemName(field),
        value,
        disabled: true,
        props: {
          required,
        }
      };

      let element;
      if (this.template[field] && this.template[field]["values"]) {
        element = Components.combobox({
          ...props,
          values: this.template[field]["values"]
        });
      } else {
        element = Components.input(props);
      }
      list.appendChild(element);
    });

    container.append(header, list);
    return container;
  }
  edit(value=true) {
    this.fields.forEach(([field, _]) => {
      document.getElementById(`cb_${this.callback.id}_${field}`).disabled = !value;
    });
    if (value) {
      this.controls["cancel"].style.display = "";
      this.controls["save"].style.display = "";
      this.controls["delete"].style.display = "None";
      this.controls["edit"].style.display = "None";
    } else {
      this.controls["cancel"].style.display = "None";
      this.controls["save"].style.display = "None";
      this.controls["delete"].style.display = "";
      this.controls["edit"].style.display = "";
    }
  }
  validate() {
    let result = true;
    this.fields.forEach(([field, _]) => {
      const element = document.getElementById(`cb_${this.callback.id}_${field}`);
      if (element.getAttribute("required") == "true" && !element.value) {
        result = false;
        element.classList.add("required");
      }
    });
    return result;
  }
  async save() {
    if (!this.validate()) {
      return;
    }
    
    this.fields.forEach(([field, _]) => {
      this.callback[field] = document.getElementById(`cb_${this.callback.id}_${field}`).value;
    });
    let result;
    if (this.callback.id === "New") {
      result = await DeviceApi.createCallback({ 
        observable: this.observable,
        callback: this.callback,
      });
    } else {
      result = await DeviceApi.updateCallback({ 
        observable: this.observable,
        callback: this.callback,
      });
    }
    if (result) {
      toast.success({
        caption: `Callback ${this.callback.id === "New" ? "created" : "updated"}!`
      });
      document.getElementById(this.id).remove();
      this.parent.update();
    } else {
      toast.error({
        caption: "Failed to save toast",
        description: "Check device logs for additional information",
      });
    }
  }
  async delete() {
    if (confirm("Are you sure you wan to delete callback " + this.callback.id + "?")) {
      const result = await DeviceApi.deleteCallback({ 
        observable: this.observable,
        id: this.callback.id,
      });
      if (result) {
        toast.success({
          caption: "Callback deleted"
        });
        this.parent.update();
      } else {
        toast.error({
          caption: "Failed to delete callback",
          description: "Check device logs for additional information",
        })
      }
    }
  }
  cancel() {
    if(this.callback.id === "New") {
      document.getElementById(this.id).remove();
      this.parent.update();
    } else {
      this.edit(false);
    }
  }
}

export class CallbacksView {
  constructor({ id="", observable }) {
    this.id = id;
    this.observable = observable;
  }
  create() {
    const exists = document.getElementById(this.id);
    if (this.id && exists) {
      return exists;
    }
    const div = document.createElement("div");
    div.id = this.id;

    this.comboboxTemplates = Components.combobox({
      values: [],
      label: "Add callback of type",
      onChange: (type) => {
        this.addNewCallback(type);
      }
    });

    this.list = Components.list();
    this.list.id = "cb_list_" + this.id;
    this.list.classList.add("callbacks-list-view");
    
    div.append(this.comboboxTemplates , this.list);

    this.firstLoad();

    return div;
  }
  update() {
    this.loadCallbacks();
  }
  async firstLoad() {
    await this.loadTemplates();
    this.loadCallbacks();
  }
  async loadTemplates() {
    this.templates = await DeviceApi.getCallbacksTemplates();
    if (!this.templates) {
      toast.error({
        caption: "Something gone wrong",
        description: "Failed to fetch callbacks templates",
      });
      return;
    }
    fillCombobox(
      this.comboboxTemplates, 
      Object.keys(this.templates)
        .filter((value) => value !== "default")
        .reduce(((acc, key) => {
          acc[key] = normalizeSystemName(key);
          return acc;
        }), {})
    );
  }
  async loadCallbacks() {
    if (!this.templates) {
      return;
    }
    this.list.innerHTML = "";
    this.callbacks = undefined;
    this.callbacks = await DeviceApi.getCallbacks({ observable: this.observable });
    if (!this.callbacks) {
      toast.error({
        caption: "Something gone wrong",
        description: `Failed to fetch callbacks for [${this.observable.type}]${this.observable.name}`,
      });
      return;
    }

    if (!this.callbacks || this.callbacks.length === 0) {
      this.list.innerHTML = "<h3 class='title'>No callbacks added yet</h3>";
      return;
    }

    this.callbacks.forEach((callback) => this.list.appendChild(
      new CallbackView({
        id: "cb_" + callback.id,
        callback,
        template: this.templates[callback.type],
        observable: this.observable,
        parent: this,
      }).create()
    ));
  }
  addNewCallback(type) {
    const existing = document.getElementById("cb_new");
    if (existing) {
      existing.remove();
    }
    if (!type) {
      return;
    }
    const template = { ...this.templates[type], ...this.templates["default"] };
    const callbackFromTemplate = Object.entries(template)
                .reduce((acc, [key, info]) => {
                    acc[key] = info["default"] || ""
                    return acc
                }, {id: "New", type})
    const view = new CallbackView({
      id: "cb_new",
      callback: callbackFromTemplate,
      template,
      observable: this.observable,
      parent: this,
    });
    this.list.prepend(view.create());
    view.edit();
  }
}

/**
 * Todo:
 * -- add Callback view
 * -- add update button (recreate content?)
 * -- add Loading
 * -- add Toasts
 */