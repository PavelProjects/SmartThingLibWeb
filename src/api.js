let { hostname } = window.location;
if (hostname === "localhost") {
  hostname = "192.168.2.106";
}
export const FETCH_FAILED_CATION = "Something gone wrong";

export const DeviceApi = {
  info: async () => {
    try {
      const { data } = await restRequest({ path: "/info/system" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  actions: async () => {
    try {
      const { data } = await restRequest({ path: "/info/actions" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  configInfo: async () => {
    try {
      const { data } = await restRequest({ path: "/info/config" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  getWifi: async () => {
    try {
      const { data } = await restRequest({ path: "/wifi" });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  saveWifi: async ({ ssid, password, mode }) => {
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
  execAction: async (action) => {
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
  sensors: async () => {
    try {
      const { data } = await restRequest({ path: "/sensors" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  states: async () => {
    try {
      const { data } = await restRequest({ path: "/states" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  config: async () => {
    try {
      const { data } = await restRequest({ path: "/config" });
      return data || {};
    } catch (error) {
      console.error(error);
    }
  },
  dropConfig: async () => {
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
  saveConfig: async (values) => {
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
  hooks: async ({ observable:{name, type} }) => {
    try {
      const { data } = await restRequest({
        path: "/hooks/by/observable",
        params: { name, type }
      })
      return data || [];
    } catch (error) {
      console.error(error);
    }
  },
  hooksTemplates: async () => {
    try {
      const { data } = await restRequest({
        path: "/hooks/templates",
      })
      return data || [];
    } catch (error) {
      console.error(error);
    }
  },
  createHook: async ({ observable: {name, type}, hook }) => {
    try {
      const { status } = await restRequest({
        path: "/hooks",
        method: "POST",
        payload: {
          observable: { name, type },
          hook
        }
      });
      return status === 201;
    } catch (error) {
      console.error(error);
    }
  },
  updateHook: async ({ observable: {name, type}, hook }) => {
    try {
      const { status } = await restRequest({
        path: "/hooks",
        method: "PUT",
        payload: {
          observable: { name, type },
          hook
        }
      });
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  deleteHook: async ({ observable: {name, type}, id }) => {
    try {
      const { status } = await restRequest({
        path: "/hooks",
        method: "DELETE",
        params: { name, type, id }
      });
      return status === 200;
    } catch (error) {
      console.error(error);
    }
  },
  metrics: async () => {
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
  xhr.open(method, `http://${hostname}${path[0] != '/' ? '/' : ''}${path}${joinRequestParams(params)}`);
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