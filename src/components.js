
export const Components = {
  container: ({ bordered=false }) => {
    const div = document.createElement("div");
    if (bordered) {
      div.classList.add("bordered");
    }
    return div;
  },
  list: () => {
    const div = document.createElement("div");
    div.classList.add("list");
    return div;
  },
  button: ({ id, label, labelElement="h3", onClick, danger=false, visible=true }) => {
    const btn = document.createElement("button");
    if (id) {
      btn.id = id;
    }
    btn.classList.add("btn");
    const btnLbl = `<${labelElement}>${label}</${labelElement}>`;
    btn.innerHTML = btnLbl;
    if (onClick) {
      btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = "Loading...";
        try {
          await onClick();
        } catch (error) {
          console.error(error);
        } finally {
          btn.innerHTML = btnLbl;
          btn.disabled = false;
        }
      };
    }
    if (danger) {
      btn.style.backgroundColor = "var(--color-danger)";
    }
    if (!visible) {
      btn.style.display = "None";
    }
    return btn;
  },
  icon: ({ id, icon, onClick=() => {}, visible=true }) => {
    const span = document.createElement("span");
    if (id) {
      span.id = id;
    }
    span.ariaHidden = true;
    span.role = "img";
    span.innerHTML = icon;
    if (!visible) {
      span.style.display = "None";
    }
    span.style.cursor = "pointer";
    span.onclick = onClick;
    return span;
  },
  input: ({ id, label, value, disabled=false, type="text", slot, props={} }) => {
    const div = document.createElement("div");
    div.classList.add("field-container");

    const labelH = document.createElement("h2");
    labelH.classList.add("field-label");
    labelH.innerHTML = label;

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-with-slot");

    const input = document.createElement("input");
    if (id) {
      input.id = id;
    }
    input.disabled = disabled;
    input.value = value;
    input.type = type
    Object.entries(props).forEach(([key, value]) => input.setAttribute(key, value));
    
    inputContainer.appendChild(input);
    if (slot) {
      inputContainer.appendChild(slot);
    }

    div.append(labelH, inputContainer);
    return div;
  },
  combobox: ({ id, value, values, label, disabled=false, onChange, props={} }) => {
    const container = document.createElement("div");
    container.classList.add("field-container");
    if (label) {
      const lbl = document.createElement("h2");
      lbl.classList.add("field-label");
      lbl.innerHTML = label;
      container.appendChild(lbl);
    }
    const select = document.createElement("select");
    if (id) {
      select.id = id;
    }
    select.disabled = disabled;
    select.appendChild(document.createElement("option"));   
    if (onChange) {
      select.onchange = () => onChange(select.value);
    }
    Object.entries(props).forEach(([key, value]) => select.setAttribute(key, value));
    container.append(select);
    fillCombobox(container, values);
    if (value) {
      select.value = value;
    }

    return container;
  },
  tree: (values) => {
    const ul = document.createElement("ul");
    Object.entries(values).forEach(
      ([key, value]) => ul.appendChild(treeNode({key, value}))
    );
    return ul;
  },
  controlsHolder: () => {
    const controls = document.createElement("div");
    controls.classList.add("controls-holder");
    return controls;
  }
}

export const Icons = {
  pencil: '<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"><!----></path></svg>',
  trash: '<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"><!----></path></svg>',
  cross: '<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"><!----></path></svg>',
  save: '<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"><!----></path></svg>',
  update: '<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path></svg>',
};

export function fillCombobox(combobox, values) {
  if (!values) {
    return;
  }
  const select = combobox.getElementsByTagName("select")[0];
  if (!select) {
    console.error("Can't find select in combobox");
    return;
  }
  let mappedValues;
  if (Array.isArray(values)) {
    mappedValues = values.map((key) => ({key, caption: key}));
  } else {
    mappedValues = Object.entries(values).map(([key, caption]) => ({key, caption}));
  }
  mappedValues.forEach(({key, caption}) => {
    const option = document.createElement("option");
    option.value = key;
    option.innerHTML = caption;
    select.appendChild(option);
  });
}

const treeNode = ({ key, value }) => {
  const li = document.createElement("li");
  li.append(key + ": ", treeValue(value));
  return li;
}

const treeValue = (value) => {
  if (Array.isArray(value)) {
    const ul = document.createElement("ul");
    value.forEach((v) => {
      const li = document.createElement("li");
      li.innerHTML = v;
      ul.appendChild(li);
    })
    return ul;
  } else if (value instanceof Object) {
    const ul = document.createElement("ul");
    Object.entries(value).forEach(([key, v]) => {
      const li = document.createElement("li");
      li.appendChild(treeNode({ key, value: v }));
      ul.appendChild(li);
    })
    return ul;
  } else {
    const span = document.createElement("span");
    span.innerHTML = value;
    return span;
  }
}