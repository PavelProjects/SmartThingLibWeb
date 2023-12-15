
export const Components = {
  list: () => {
    const div = document.createElement("div");
    div.classList.add("list");
    return div;
  },
  button: ({ id, label, onClick=() => {}, labelElement="h3", danger=false }) => {
    const btn = document.createElement("button");
    if (id) {
      btn.id = id;
    }
    btn.innerHTML = `<${labelElement}>${label}</${labelElement}>`;
    btn.onclick = onClick;
    if (danger) {
      btn.style.backgroundColor = "var(--color-danger)";
    }
    return btn;
  },
  input: ({ id, label, value, disabled=false, type="text", slot }) => {
    const div = document.createElement("div");
    div.classList.add("legit", "field-container");

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
    
    inputContainer.appendChild(input);
    if (slot) {
      inputContainer.appendChild(slot);
    }

    div.append(labelH, inputContainer);
    return div;
  },
  tree: (values) => {
    const ul = document.createElement("ul");
    Object.entries(values).forEach(
      ([key, value]) => ul.appendChild(treeNode({key, value}))
    );
    return ul;
  }
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