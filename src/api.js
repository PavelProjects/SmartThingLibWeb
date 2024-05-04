let { hostname } = window.location;
if (hostname === "localhost") {
  hostname = "192.168.2.2";
}
export const FETCH_FAILED_CATION = "Something gone wrong";

export const DeviceApi = {
  info: async () => {
    return (await restRequest({ path: "/info/system" })).data;
  },
  actions: async () => {
    return (await restRequest({ path: "/info/actions" })).data;
  },
  configInfo: async () => {
    return (await restRequest({ path: "/info/config" })).data;
  },
  getWifi: async () => {
    return (await restRequest({ path: "/wifi" })).data;
  },
  saveWifi: async (payload) => {
    await restRequest({ 
      path: "/wifi",
      method: "POST",
      payload
    })
  },
  saveName: async (name) => {
    await restRequest({
      path: "/info/system",
      method: "PUT",
      payload: {
        name
      }
    })
  },
  execAction: async (action) => {
    await restRequest({
      method: "PUT",
      path: "/actions",
      params: { action }
    })
  },
  sensors: async () => {
    return (await restRequest({ path: "/sensors" })).data
  },
  states: async () => {
    return (await restRequest({ path: "/states" })).data
  },
  config: async () => {
    return (await restRequest({ path: "/config" })).data
  },
  dropConfig: async () => {
    await restRequest({ 
      method: "DELETE",
      path: "/config/delete/all"
    })
  },
  saveConfig: async (values) => {
    await restRequest({
      method: "POST",
      path: "/config",
      payload: values
    })
  },
  hooks: async ({ observable:{name, type} }) => {
    return (await restRequest({
      path: "/hooks/by/observable",
      params: { name, type }
    })).data
  },
  hooksTemplates: async (type) => {
    return (await restRequest({
      path: "/hooks/templates",
      params: { type }
    })).data
  },
  createHook: async ({ observable: {name, type}, hook }) => {
    await restRequest({
      path: "/hooks",
      method: "POST",
      payload: {
        observable: { name, type },
        hook
      }
    })
  },
  updateHook: async ({ observable: {name, type}, hook }) => {
    await restRequest({
      path: "/hooks",
      method: "PUT",
      payload: {
        observable: { name, type },
        hook
      }
    })
  },
  deleteHook: async ({ observable: {name, type}, id }) => {
    await restRequest({
      path: "/hooks",
      method: "DELETE",
      params: { name, type, id }
    })
  },
  features: async () => {
    return (await restRequest({ path: "/features"})).data
  },
  metrics: async () => {
    return (await restRequest({ path: "/metrics" })).data
  }
};

function joinRequestParams(requestParams) {
  if (!requestParams || !Object.keys(requestParams)) {
    return "";
  }
  const params = Object.entries(requestParams).map(([key, value]) => `${key}=${value}`)
  return params.length > 0 ? "?" + params.join("&") : ""
}

function restRequest({method="GET", path, payload, params}) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, `http://${hostname}${path[0] != '/' ? '/' : ''}${path}${joinRequestParams(params)}`, true);
  xhr.setRequestHeader("Accept", "application/json");
  if (payload) {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  let resolver;
  const promise = new Promise((resolve) => resolver = resolve);

  xhr.onloadend = () => {
    let data
    try {
      data = xhr.response ? JSON.parse(xhr.response) : null
    } catch (error) {
      console.log(error)
    }
    resolver({data, status: xhr.status});
  };
  xhr.send(payload ? JSON.stringify(payload) : null);
  return promise;
}