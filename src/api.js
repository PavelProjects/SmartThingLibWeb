let { host } = window.location;
if (host === "localhost:5173") {
  host = "192.168.2.2";
}

export const DeviceApi = {
  getSystemInfo: async () => {
    try {
      const { data } = await restRequest({ path: "/info/system" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  getActions: async () => {
    try {
      const { data } = await restRequest({ path: "/info/actions" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  getConfigInfo: async () => {
    try {
      const { data } = await restRequest({ path: "/info/config" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  getWifiSettings: async () => {
    try {
      const { data } = await restRequest({ path: "/wifi" });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  saveWifiSettings: async ({ ssid, password, mode }) => {
    try {
      const { status } = await restRequest({ 
        path: "/wifi",
        method: "POST",
        payload: {
          ssid, password, mode
        }
      });
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  saveName: async (name) => {
    try {
      const { status } = await restRequest({
        path: "/info/system",
        method: "PUT",
        payload: {
          name
        }
      })
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  performAction: async (action) => {
    try {
      const { status } = await restRequest({
        method: "PUT",
        path: "/actions",
        params: { action }
      });
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  getSensors: async () => {
    try {
      const { data } = await restRequest({ path: "/sensors" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  getStates: async () => {
    try {
      const { data } = await restRequest({ path: "/states" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  getConfigValues: async () => {
    try {
      const { data } = await restRequest({ path: "/config" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  deleteAllConfigValues: async () => {
    try {
      const { status } = await restRequest({ 
        method: "DELETE",
        path: "/config/delete/all"
      })
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  saveConfigValues: async (values) => {
    try {
      const { status } = await restRequest({
        method: "POST",
        path: "/config",
        payload: values
      });
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  getCallbacks: async ({ observable:{name, type} }) => {
    try {
      const { data } = await restRequest({
        path: "/callback/by/observable",
        params: { name, type }
      })
      return data || [];
    } catch (error) {
      console.error(error);
    }
  },
  getCallbacksTemplates: async () => {
    try {
      const { data } = await restRequest({
        path: "/callback/template",
      })
      return data || [];
    } catch (error) {
      console.error(error);
    }
  },
  createCallback: async ({ observable: {name, type}, callback }) => {
    try {
      const { status } = await restRequest({
        path: "/callback",
        method: "POST",
        payload: {
          observable: { name, type },
          callback
        }
      });
      return status === 201;
    } catch (error) {
      console.error(error);
    }
  },
  updateCallback: async ({ observable: {name, type}, callback }) => {
    try {
      const { status } = await restRequest({
        path: "/callback",
        method: "PUT",
        payload: {
          observable: { name, type },
          callback
        }
      });
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  deleteCallback: async ({ observable: {name, type}, id }) => {
    try {
      const { status } = await restRequest({
        path: "/callback",
        method: "DELETE",
        params: { name, type, id }
      });
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  getMetrics: async () => {
    try {
      const { data } = await restRequest({ path: "/metrics" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
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
      if (xhr.readyState === 4){
        resolver({
            data: xhr.response ? JSON.parse(xhr.response) : null,
            status: xhr.status
        });
      }
    };
  xhr.send(payload ? JSON.stringify(payload) : null);
  return promise;
}