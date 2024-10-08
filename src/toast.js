let idSequence = 0;
const LIFE_TIME = 5000;

const TOAST_TYPE = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

function removeToast(id) {
  const toast = document.getElementById(id);
  if (toast) {
    toast.remove();
  }
}

function getColor(type) {
  switch (type) {
    case TOAST_TYPE.ERROR:
      return "rgb(171, 12, 12)";
    case TOAST_TYPE.SUCCESS:
      return "rgb(2, 147, 74)";
    case TOAST_TYPE.WARNING:
      return "rgb(147, 106, 2)";
    default:
      return "rgb(0, 112, 122)";
  }
}

function addToast({ type = TOAST_TYPE.INFO, caption, description = "" }) {
  const container = document.createElement("div");
  container.classList.add("toast");
  const id = "toast-" + idSequence++;
  container.id = id;
  container.style.backgroundColor = getColor(type);

  const captionDiv = document.createElement("h2");
  captionDiv.id = id + "-caption";
  captionDiv.innerHTML = caption;
  const descriptionDiv = document.createElement("div");
  descriptionDiv.id = id + "-description";
  descriptionDiv.style.overflowWrap = "break-word";
  descriptionDiv.innerHTML = description;

  container.append(captionDiv, descriptionDiv);
  container.onclick = () => removeToast(id);

  document.getElementById("toasts-list").appendChild(container);

  setTimeout(() => removeToast(id), LIFE_TIME);
}

export const toast = {
  info: ({ caption, description }) => addToast({ caption, description }),
  error: ({ caption, description }) =>
    addToast({ type: TOAST_TYPE.ERROR, caption, description }),
  success: ({ caption, description }) =>
    addToast({ type: TOAST_TYPE.SUCCESS, caption, description }),
  warning: ({ caption, description }) =>
    addToast({ type: TOAST_TYPE.WARNING, caption, description }),
};
