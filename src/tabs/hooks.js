import { DeviceApi } from "../api";
import { Components, Icons, fillCombobox } from "../components";
import { toast } from "../toast";

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

export class HookView {
  constructor({id="", hook, template, observable, parent}) {
    this.id = id;
    this.hook = hook;
    this.template = template;
    this.observable = observable;
    this.parent = parent;

    this.fields = Object.entries(this.hook)
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
    header.classList.add("hook-header");

    const { id, caption, type } = this.hook;
    const title = Components.title(`[${id}] ${caption || normalizeSystemName(type)}`, 'h2');
    title.classList.add("hook-title");

    const controls = document.createElement("div");
    controls.classList.add("hook-view-controls");
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
      document.getElementById(`cb_${this.hook.id}_${field}`).disabled = !value;
    });
    if (value) {
      this.controls["cancel"].style.display = "";
      this.controls["save"].style.display = "";
      this.controls["delete"].style.display = "none";
      this.controls["edit"].style.display = "none";
    } else {
      this.controls["cancel"].style.display = "none";
      this.controls["save"].style.display = "none";
      this.controls["delete"].style.display = "";
      this.controls["edit"].style.display = "";
    }
  }
  validate() {
    let result = true;
    this.fields.forEach(([field, _]) => {
      const element = document.getElementById(`cb_${this.hook.id}_${field}`);
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
      this.hook[field] = document.getElementById(`cb_${this.hook.id}_${field}`).value;
    });
    let result;
    if (this.hook.id === "New") {
      delete this.hook.id
      result = await DeviceApi.createHook({ 
        observable: this.observable,
        hook: this.hook,
      });
    } else {
      result = await DeviceApi.updateHook({ 
        observable: this.observable,
        hook: this.hook,
      });
    }
    if (result) {
      toast.success({
        caption: `Hook ${this.hook.id === "New" ? "created" : "updated"}!`
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
    if (confirm("Are you sure you wan to delete hook " + this.hook.id + "?")) {
      const result = await DeviceApi.deleteHook({ 
        observable: this.observable,
        id: this.hook.id,
      });
      if (result) {
        toast.success({
          caption: "Hook deleted"
        });
        this.parent.update();
      } else {
        toast.error({
          caption: "Failed to delete hook",
          description: "Check device logs for additional information",
        })
      }
    }
  }
  cancel() {
    if(this.hook.id === "New") {
      document.getElementById(this.id).remove();
      this.parent.update();
    } else {
      this.edit(false);
    }
  }
}

export class HooksView {
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
      label: "Add hook of type",
      onChange: (type) => {
        this.addNewHook(type);
      }
    });

    this.list = Components.list();
    this.list.id = "cb_list_" + this.id;
    this.list.classList.add("hooks-list-view");
    
    div.append(this.comboboxTemplates , this.list);

    this.firstLoad();

    return div;
  }
  update() {
    this.loadHooks();
  }
  async firstLoad() {
    await this.loadTemplates();
    this.loadHooks();
  }
  async loadTemplates() {
    this.templates = await DeviceApi.hooksTemplates(this.observable.type);
    if (!this.templates) {
      toast.error({
        caption: "Something gone wrong",
        description: "Failed to fetch hooks templates",
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
  async loadHooks() {
    if (!this.templates) {
      return;
    }
    this.list.innerHTML = "";
    this.hooks = undefined;
    this.hooks = await DeviceApi.hooks({ observable: this.observable });
    if (!this.hooks) {
      toast.error({
        caption: "Something gone wrong",
        description: `Failed to fetch hooks for [${this.observable.type}]${this.observable.name}`,
      });
      return;
    }

    if (!this.hooks || this.hooks.length === 0) {
      this.list.appendChild(Components.title('No hooks added yet', 'h3'));
      return;
    }

    this.hooks.forEach((hook) => this.list.appendChild(
      new HookView({
        id: "cb_" + hook.id,
        hook,
        template: {...this.templates[hook.type], ...this.templates["default"] },
        observable: this.observable,
        parent: this,
      }).create()
    ));
  }
  addNewHook(type) {
    const existing = document.getElementById("cb_new");
    if (existing) {
      existing.remove();
    }
    if (!type) {
      return;
    }
    const template = { ...this.templates[type], ...this.templates["default"] };
    const hookFromTemplate = Object.entries(template)
                .reduce((acc, [key, info]) => {
                    acc[key] = info["default"] || ""
                    return acc
                }, {id: "New", type})
    const view = new HookView({
      id: "cb_new",
      hook: hookFromTemplate,
      template,
      observable: this.observable,
      parent: this,
    });
    this.list.prepend(view.create());
    view.edit();
  }
}