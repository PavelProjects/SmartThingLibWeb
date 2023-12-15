export const createCallbackView = ({ name, type }) => {
  const div = document.createElement("div");
  div.innerHTML = `Not done yet :( ([${type}]${name})`;
  return div;
}

/**
 * Todo:
 * -- add Callback view
 * -- add Loading
 * -- add Toasts
 */