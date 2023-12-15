// const { host } = window.location;
const host = "192.168.2.2";

export const DeviceApi = {
  getSystemInfo: async () => {
    const { data } = await restRequest({ path: "/info/system" });
    return data || {};
  },
  saveName: async (name) => {
    const { status } = await restRequest({
      path: "/info/system",
      method: "PUT",
      payload: {
        name
      }
    })
    return status !== 200;
  },
  getActions: async () => {
    const { data } = await restRequest({ path: "/info/actions" });
    return data || [];
  },
  performAction: async (action) => {
    const { status } = await restRequest({
      method: "PUT",
      path: "/actions",
      params: { action }
    });
    return status === 200;
  },
  getSensors: async () => {
    const { data } = await restRequest({ path: "/sensors" });
    return data || {};
  },
  getStates: async () => {
    const { data } = await restRequest({ path: "/states" });
    return data || {};
  },
  getConfigInfo: async () => {
    const { data } = await restRequest({ path: "/info/config" });
    return data || {};
  },
  getConfigValues: async () => {
    const { data } = await restRequest({ path: "/config" });
    return data || {};
  },
  deleteAllConfigValues: async () => {
    const { status } = await restRequest({ 
      method: "DELETE",
      path: "/config/delete/all"
    })
    return status === 200;
  },
  saveConfigValues: async (values) => {
    const { status } = await restRequest({
      method: "POST",
      path: "/config",
      payload: values
    });
    return status === 200;
  },
  getMetrics: async () => {
    const { data } = await restRequest({ path: "/metrics" });
    return data || {};
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
  xhr.open(method, `http://${host}${path[0] != '/' ? '/' : ''}${path}${joinRequestParams(params)}`);
  xhr.setRequestHeader("Accept", "application/json");
  if (payload) {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  let resolver;
  const promise = new Promise((resolve) => resolver = resolve);

  xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 ){
        resolver({
            data: xhr.response ? JSON.parse(xhr.response) : null,
            status: xhr.status
        });
      }
    };
  xhr.send(payload ? JSON.stringify(payload) : null);
  return promise;
}