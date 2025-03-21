const WIFI_PATH = '/wifi'
const INFO_PATH = '/info/system'
const DANGER_PATH = '/danger'

const GET_METHOD = 'GET'
const POST_METHOD = 'POST'

let { hostname } = window.location;
if (hostname === "localhost") {
  hostname = "192.168.1.9";
}

const getElement = (id) => document.getElementById(id)
const createElement = (tag, innerHtml, value) => {
  const el = document.createElement(tag)
  if (innerHtml)
    el.innerHTML = innerHtml
  if (value)
    el.value = value
  return el
}

const toast = (message) => {
  getElement('tst').appendChild(createElement('li', message))
}

const request = (method, path, payload, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onloadend = () => {
    callback(
      xhr.response ? JSON.parse(xhr.response) : null,
      xhr.status
    )
  };
  xhr.open(method, `http://${hostname}${path}`, true);
  xhr.setRequestHeader("Accept", "application/json");
  if (payload) {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  xhr.send(payload ? JSON.stringify(payload) : null);
}

const saveName = () => {
  request("PUT", INFO_PATH, {
    name: getElement("name").value
  }, (data, status) => {
    if (status === 200) {
      toast("Name updated")
    } else [
      toast("Failed to update name: " + data?.error)
    ]
  })
}

const saveWifi = () => {
  request(POST_METHOD, WIFI_PATH, {
    ssid: getElement("ssid").value,
    password: getElement("password").value,
    mode: getElement("mode").value
  }, (data, status) => {
    if (status === 200) {
      toast("WiFi updated! Restart device to reconnect")
    } else {
      toast("WiFi update failed: " + data?.error)
    }
  })
}

const restartDevice = () => {
  if (confirm("Are you sure you want to restart device right now?")) {
    request(POST_METHOD, DANGER_PATH + '/restart', null, () => {
      toast("Device should restart")
    })
  }
}

const factoryReset = () => {
  if (!confirm("Are you sure you want to make FACTORY RESET?")) {
    return
  }
  if (!confirm("Factory reset will wipe ALL settings. This can't be undone! Are you sure?")) {
    return
  }
  request(POST_METHOD, DANGER_PATH + '/wipe', null, () => {
    toast("Settings wiped")
    toast("Device should restart")
  })
}

document.addEventListener('DOMContentLoaded', () => {
  getElement("sname").onclick = saveName
  getElement("swifi").onclick = saveWifi
  getElement("restart").onclick = restartDevice
  getElement("factoryReset").onclick = factoryReset

  request(GET_METHOD, INFO_PATH, null, (data, status) => {
    if (status !== 200) {
      toast("Failed to load device info")
      return
    }
    getElement('name').value = data.name
    const info = getElement("info")
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'name') {
        const input = createElement("input", null, value)
        input.disabled = true
        info.append(createElement("label", key), input)
      }
    })
  })
  request(GET_METHOD, WIFI_PATH, null, (data, status) => {
    if (status !== 200) {
      toast("Failed to load wifi info")
      return
    }

    const { settings, modes } = data
    
    const mode = getElement('mode')
    Object.entries(modes).forEach(([key, value]) => {
      mode.appendChild(createElement("option", value, key))
    })

    getElement('ssid').value = settings.ssid
    getElement('password').value = settings.password
    mode.value = settings.mode
  })
})