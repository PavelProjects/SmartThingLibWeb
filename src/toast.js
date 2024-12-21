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
      return "var(--nc11)";
    case TOAST_TYPE.WARNING:
      return "var(--nc12)";
    case TOAST_TYPE.SUCCESS:
      return "var(--nc14)";
    default:
      return "var(--nc9)";
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
