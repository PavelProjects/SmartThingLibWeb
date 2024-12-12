let { hostname } = window.location;
if (hostname === "localhost") {
  hostname = "192.168.1.11";
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
  callAction: (name) => restRequest({
    path: "/actions/call",
    params: { name },
  }),
  updateActionSchedule: (name, delay) => {
    return restRequest({
      method: METHODS.PUT,
      path: "/actions/schedule",
      payload: { name, callDelay: delay },
    })
  },
  sensors: () => restRequest({ path: `/sensors` }),
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
  hooks: ({ sensor }) => restRequest({
    path: "/hooks/by/sensor",
    params: { sensor },
  }),
  hooksTemplates: (sensor) => restRequest({
    path: "/hooks/templates",
    params: { sensor },
  }),
  createHook: ({ sensor, hook }) => restRequest({
    path: "/hooks",
    method: METHODS.POST,
    payload: {
      sensor,
      hook,
    },
  }),
  updateHook: ({ sensor, hook }) => restRequest({
    path: "/hooks",
    method: METHODS.PUT,
    payload: {
      sensor,
      hook,
    },
  }),
  deleteHook: ({ sensor, id }) => restRequest({
    path: "/hooks",
    method: METHODS.DELETE,
    params: { sensor, id },
  }),
  testHook: ({ sensor, id }) => restRequest({
    path: "/hooks/test",
    params: { sensor, id },
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
  const xhr = new XMLHttpRequest();

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
