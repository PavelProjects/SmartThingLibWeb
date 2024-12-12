import { DeviceApi, FETCH_FAILED_CATION } from "../api";
import { Components, Icons, fillCombobox } from "../components";
import { toast } from "../toast";

function normalizeSystemName(value) {
  if (typeof value != "string" || value.length == 0) {
    return "";
  }
  return value.split("").reduce((acc, ch) => {
    if (ch === "_") {
      acc += " ";
    } else if (ch === ch.toUpperCase()) {
      acc += " " + ch.toLowerCase();
    } else {
      acc += ch;
    }
    return acc;
  }, "");
}

const SYSTEM_FIELDS = ["id", "type", "readonly"];
function isDefaultField(key) {
  return SYSTEM_FIELDS.includes(key);
}

export class HookView {
  constructor({ id = "", hook, template, sensor, parent }) {
    this.id = id;
    this.hook = hook;
    this.template = template;
    this.sensor = sensor;
    this.parent = parent;

    this.fields = Object.entries(this.hook)
      .filter(([key, ]) => !isDefaultField(key))
      .reverse();

    this.controls = {
      test: Components.icon({
        icon: Icons.tube,
        onClick: () => this.test(),
        title: "Make a test hook call",
      }),
      delete: Components.icon({
        icon: Icons.trash,
        onClick: () => this.delete(),
      }),
      edit: Components.icon({
        icon: Icons.pencil,
        onClick: () => this.edit(),
      }),
      cancel: Components.icon({
        icon: Icons.cross,
        onClick: () => this.cancel(),
        visible: false,
      }),
      save: Components.icon({
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
    const container = Components.container();
    container.id = this.id;

    const headerBlock = document.createElement("div");
    headerBlock.classList.add("hook-header");

    const { id, caption, type } = this.hook;
    const header = Components.header(
      `[${id}] ${caption || normalizeSystemName(type)}`,
      "h2",
    );
    header.classList.add("hook-header");

    const controls = document.createElement("div");
    controls.classList.add("hook-view-controls");
    Object.values(this.controls).forEach((v) => controls.appendChild(v));

    headerBlock.append(header, controls);

    const list = Components.list();
    const isNumberType = this.fields.find(([name]) => name === 'threshold')
    this.fields.forEach(([field, value]) => {
      const { required } = this.template[field] ?? false;
      const props = {
        id: `${this.id}_${field}`,
        label: normalizeSystemName(field),
        value,
        disabled: true,
        props: {
          required,
        },
      };

      let element;
      if (this.template[field] && this.template[field]["values"]) {
        element = Components.combobox({
          ...props,
          values: this.template[field]["values"],
        });
      } else {
        if (["trigger", "threshold"].includes(field) && isNumberType) {
          props.type = "number"
        } else if (field === 'triggerEnabled') {
          props.type = 'checkbox'
        }
        element = Components.input(props);
      }
      list.appendChild(element);
    });

    container.append(headerBlock, list);
    return container;
  }
  edit(value = true) {
    this.fields.forEach(([field, ]) => {
      document.getElementById(`${this.id}_${field}`).disabled = !value;
    });
    if (value) {
      this.controlsVisibile(["cancel", "save"], true);
      this.controlsVisibile(["delete", "edit", "test"], false);
    } else {
      this.controlsVisibile(["cancel", "save"], false);
      this.controlsVisibile(["delete", "edit", "test"], true);
    }
  }
  controlsVisibile(names, visible) {
    names.forEach(
      (name) => (this.controls[name].style.display = visible ? "" : "none"),
    );
  }
  validate() {
    let result = true;
    this.fields.forEach(([field, ]) => {
      const element = document.getElementById(`${this.id}_${field}`);
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

    this.fields.forEach(([field, ]) => {
      const { checked, value } = document.getElementById(
        `${this.id}_${field}`,
      );
      this.hook[field] = field === 'triggerEnabled' ? checked : value
    });
    
    let saveFunc
    if (this.hook.id === "New") {
      delete this.hook.id;
      saveFunc = DeviceApi.createHook
    } else {
      saveFunc = DeviceApi.updateHook
    }
    await saveFunc({
      sensor: this.sensor,
      hook: this.hook,
    }).then(() => {
      toast.success({
        caption: `Hook ${this.hook.id === "New" ? "created" : "updated"}!`,
      })
      document.getElementById(this.id).remove();
      this.parent.update();
    }).catch(() => 
      toast.error({
        caption: "Failed to save hook",
        description: "Check device logs for additional information",
      })
    )
  }
  async delete() {
    if (confirm("Are you sure you wan to delete hook " + this.hook.id + "?")) {
      await DeviceApi.deleteHook({
        sensor: this.sensor,
        id: this.hook.id,
      }).then(() => {
        toast.success({ caption: "Hook deleted" })
        this.parent.update()
      }).catch(() => 
        toast.error({
          caption: "Failed to delete hook",
          description: "Check device logs for additional information",
        })
      )
    }
  }
  async test() {
    await DeviceApi.testHook({
      sensor: this.sensor,
      id: this.hook.id,
    }).then(() => toast.success({
      caption: "Hook called successfully!",
    })).catch(() => toast.error({
      caption: "Failed to call hook",
    }))
  }
  cancel() {
    if (this.hook.id === "New") {
      document.getElementById(this.id).remove();
      this.parent.update();
    } else {
      this.edit(false);
    }
  }
}

export class HooksView {
  constructor({ id = "", sensor }) {
    this.id = id;
    this.sensor = sensor;
  }
  create() {
    const exists = document.getElementById(this.id);
    if (this.id && exists) {
      return exists;
    }
    const div = document.createElement("div");
    div.id = this.id;
    div.style.padding = "2px";

    this.comboboxTemplates = Components.combobox({
      values: [],
      label: "Add hook of type",
      onChange: (type) => {
        this.addNewHook(type);
      },
    });

    this.list = Components.list();
    this.list.id = "cb_list_" + this.id;
    this.list.classList.add("hooks-list-view");

    div.append(this.comboboxTemplates, this.list);

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
    this.templates = await DeviceApi.hooksTemplates(this.sensor)
      .then(({ data }) => data)
      .catch(() => toast.error({ caption: FETCH_FAILED_CATION }));
    if (!this.templates) {
      return;
    }
    fillCombobox(
      this.comboboxTemplates,
      Object.keys(this.templates)
        .filter((value) => value !== "default")
        .reduce((acc, key) => {
          acc[key] = normalizeSystemName(key);
          return acc;
        }, {}),
    );
  }
  // todo список хуков не обновляется после сохранения хука
  async loadHooks() {
    this.list.innerHTML = "";
    this.hooks = await DeviceApi.hooks({ sensor: this.sensor })
      .then(({ data }) => data)
      .catch(() => toast.error({ caption: FETCH_FAILED_CATION }));
    if (!this.hooks || this.hooks.length === 0) {
      this.list.appendChild(Components.header("No hooks added yet", "h3"));
      return;
    }

    this.hooks.forEach((hook) =>
      this.list.appendChild(
        new HookView({
          id: `${this.sensor}_hook_${hook.id}`,
          hook,
          template: {
            ...this.templates[hook.type],
            ...this.templates["default"],
          },
          sensor: this.sensor,
          parent: this,
        }).create(),
      ),
    );
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
    const hookFromTemplate = Object.entries(template).reduce(
      (acc, [key, info]) => {
        acc[key] = info["default"] || "";
        return acc;
      },
      { id: "New", type },
    );
    const view = new HookView({
      id: "cb_new",
      hook: hookFromTemplate,
      template,
      sensor: this.sensor,
      parent: this,
    });
    this.list.prepend(view.create());
    view.edit();
  }
}
