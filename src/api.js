let { hostname } = window.location;
if (hostname === "localhost") {
  hostname = "192.168.1.13";
}
export const FETCH_FAILED_CATION = "Something gone wrong";

const METHODS = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
}

export const DeviceApi = {
  features: () => restRequest({ path: "/features" }),
  info: () => restRequest({ path: "/info/system" }),
  actions: () => restRequest({ path: "/actions/info" }),
  configInfo: () => restRequest({ path: "/config/info" }),
  getWifi: () => restRequest({ path: "/wifi" }),
  saveWifi: (payload) => restRequest({
    path: "/wifi",
    method: METHODS.POST,
    payload,
  }),
  saveName: (name) => restRequest({
    path: "/info/system",
    method: METHODS.PUT,
    payload: {
      name,
    },
  }),
  callAction: (action) => restRequest({
    method: METHODS.GET,
    path: "/actions/call",
    params: { action },
  }),
  updateActionSchedule: (name, delay) => {
    return restRequest({
      method: METHODS.PUT,
      path: "/actions/schedule",
      payload: { name, callDelay: delay },
    })
  },
  sensors: () => restRequest({ path: "/sensors" }),
  sensorsTypes: () => restRequest({ path: "/sensors/types" }),
  states: () => restRequest({ path: "/states" }),
  config: () => restRequest({ path: "/config/values" }),
  dropConfig: () => restRequest({
    method: METHODS.DELETE,
    path: "/config/delete/all",
  }),
  saveConfig: (values) => restRequest({
    method: METHODS.POST,
    path: "/config/values",
    payload: values,
  }),
  hooks: ({ observable: { name, type } }) => restRequest({
    path: "/hooks/by/observable",
    params: { name, type },
  }),
  hooksTemplates: (type) => restRequest({
    path: "/hooks/templates",
    params: { type },
  }),
  createHook: ({ observable: { name, type }, hook }) => restRequest({
    path: "/hooks",
    method: METHODS.POST,
    payload: {
      observable: { name, type },
      hook,
    },
  }),
  updateHook: ({ observable: { name, type }, hook }) => restRequest({
    path: "/hooks",
    method: METHODS.PUT,
    payload: {
      observable: { name, type },
      hook,
    },
  }),
  deleteHook: ({ observable: { name, type }, id }) => restRequest({
    path: "/hooks",
    method: METHODS.DELETE,
    params: { name, type, id },
  }),
  testHook: ({ observable: { name, type }, id }) => restRequest({
    path: "/hooks/test",
    method: METHODS.GET,
    params: { name, type, id },
  }),
  metrics: () => restRequest({ path: "/metrics" }),
  restart: () => restRequest({ path: "/danger/restart", method: METHODS.POST }),
  wipe: () => restRequest({ path: "/danger/wipe", method: METHODS.POST }),
};

function joinRequestParams(requestParams) {
  if (!requestParams || !Object.keys(requestParams)) {
    return "";
  }
  const params = Object.entries(requestParams).map(
    ([key, value]) => `${key}=${value}`,
  );
  return params.length > 0 ? "?" + params.join("&") : "";
}

function restRequest({ method = METHODS.GET, path, payload, params }) {
  let xhr = new XMLHttpRequest();

  let resolver, rejector;
  const promise = new Promise((resolve, reject) => {resolver = resolve;  rejector = reject;});
  xhr.onloadend = () => {
    const result = {
      data: xhr.response ? JSON.parse(xhr.response) : null,
      status: xhr.status
    }

    if (xhr.status < 200 || xhr.status > 299) {
      rejector(result)
    } else {
      resolver(result);
    }
  };

  xhr.open(
    method,
    `http://${hostname}${path[0] != "/" ? "/" : ""}${path}${joinRequestParams(
      params,
    )}`,
    true,
  );``
  xhr.setRequestHeader("Accept", "application/json");
  if (payload) {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  xhr.send(payload ? JSON.stringify(payload) : null);

  return promise;
}
