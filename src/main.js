this.config = {};
this.dictionaries = {};

window.onload = function() {
    loadDeviceInfo();
    loadWiFiSettings();
    loadCallbackTemplates();
    loadState();
    loadSensors();
};
function updateCallbacks() {
    const callbacksBlock = document.getElementById("callbacks-block");
    if(callbacksBlock) {
        loadCallbacks(callbacksBlock.getAttribute("observableType"), callbacksBlock.getAttribute("observable"));
    }
}
function loadCallbacks(observableType, observable) {
    if (!observableType || !observable) {
        console.warn("Callback observableType or observable are missing!");
        return;
    }
    restRequest(
        "GET",
        "http://" + getHost() + "/callbacks/by/observable?observableType=" + observableType + "&name=" + observable,
        null,
        function (response) {
            if (response) {
                displayCallbacks(observableType, observable, JSON.parse(response));
            }
        },
        "callbacks"
    );
}

function addCallback(observableType, observable) {
    if (document.getElementById("callback_new")) {
        document.getElementById("callback_new").remove();
    }
    const callbacksBlock = document.getElementById("callbacks-block");
    if (!callbacksBlock) {
        console.error("Can't find callbacks-block!");
        return;
    }
    const type = document.getElementById("callback-types").value;
    const template = this.callbackTemplates[type];
    const additionalFields = Object.entries(template).reduce((acc, [key, _]) => {acc[key] = ""; return acc;}, {});
    callbacksBlock.prepend(
        buildCallbackView(observableType, observable, {
            type,
            "readonly": false,
            "caption": "New " + type +" callback",
            "trigger": "",
            ...additionalFields
        }, "new")
    );
}
function displayCallbacks(observableType, observable, callbacks) {
    const callbacksBlock = document.getElementById("callbacks-block");
    if (!callbacksBlock) {
        console.error("Can't find callbacks-block!");
        return;
    }
    callbacksBlock.setAttribute("observableType", observableType);
    callbacksBlock.setAttribute("observable", observable);
    callbacksBlock.innerHTML = "";
    document.getElementById("callbacks").style.display = "block";

    if (callbacks) {
        callbacks.forEach((callback, index) => {
            callbacksBlock.appendChild(buildCallbackView(observableType, observable, callback, index));
        });
    }   else {
        console.warn("Callbacks list are empty!");
    }

    const addButton = document.getElementById("add-new-callback");
    if (addButton) {
        addButton.onclick = () => {
            addCallback(observableType, observable);  
        };
    }
    document.getElementById("callbacks-title").innerHTML = observableType + " " + observable + "'s callbacks";
}
function buildCallbackView(observableType, observable, callback, index) {
    const callbackType = callback["type"];
    const div = document.createElement("div");
    div.id = "callback_" + index;
    div.className = "content-block";
    const h2 = document.createElement("h2");
    h2.innerHTML = callback["caption"] || callbackType;
    div.appendChild(h2);
    const block = document.createElement("div");
    block.className = "grid-view";
    const template = this.callbackTemplates[callbackType] || {};
    Object.entries(callback).filter(([key, _]) => key != "type" && key != "caption" && key != "readonly")
        .forEach(([key, value]) => {
            const {required, values} = template[key] || {};
            createEntryInput(
                block, 
                {
                    id: "callback_" + key + "_" + index,
                    caption: key,
                    value: value != null ? String(value) : "",
                    values,
                    disabled: callback.readonly || (key != "trigger" && !template[key])
                }
            );
        });
    div.appendChild(block);

    if (!callback.readonly) {
        const wrap = document.createElement("div");
        wrap.classList.add("btn-group", "grid-view");
        const button = document.createElement("button");
        button.innerHTML = "save"
        button.onclick = () => saveCallback(callbackType, observableType, observable, index);
        wrap.appendChild(button);
        if (index != "new") {
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "delete";
            deleteButton.style.backgroundColor = "red";
            deleteButton.onclick = () => {
                if (confirm("Are you sure you want to delete this callback?")) {
                    deleteCallback(observableType, observable, index);
                }
            };
            wrap.appendChild(deleteButton);
        }
        div.appendChild(wrap);
    }
    return div;
}
function saveCallback(callbackType, observableType, observable, index) {
    if (!index && index !== 0) {
        console.error("Index are missing!")
        return;
    }
    const template = this.callbackTemplates[callbackType] || {};
    const reqPayload = {observable: {type: observableType, name: observable}};
    const callbackInfo = {id: index, type: callbackType};
    
    callbackInfo["trigger"] = document.getElementById("callback_trigger_" + index).value;

    let valid = true;
    Object.entries(template).forEach(([key, {required, type}]) => {
        const input = document.getElementById("callback_" + key + "_" + index);
        if (input) {
            const value = input.value;
            if (!value && value != 0) {
                valid += !required;
            }
            if (type == "boolean"){
                callbackInfo[key] = value == "true";
            } else {
                callbackInfo[key] = value;
            }
        }
    })

    if (Object.keys(callbackInfo).length === 0) {
        console.error("Empty callback payload! Skipping");
        return;
    }

    if (!valid) {
        console.error("Validation failed!");
        return;
    }
    reqPayload["callback"] = callbackInfo;

    if (index == "new") {
        restRequest(
            "POST",
            "http://" + getHost() + "/callbacks/create",
            reqPayload,
            (response) => {
                console.log("Callback created!");
                loadCallbacks(observableType, observable);
            },
            "callbacks"
        )
    } else {
        restRequest(
            "PUT",
            "http://" + getHost() + "/callbacks/update",
            reqPayload,
            (response) => {
                console.log("Callback updated!");
            },
            "callbacks"
        )
    }
}
function deleteCallback(observableType, observable, index) {
    const queryPart = "?observableType=" + observableType + "&name=" + observable + "&id=" + index;
    restRequest(
        "DELETE",
        "http://" + getHost() + "/callbacks/delete" + queryPart,
        null,
        (response) => {
            console.log("Callback deleted :(");
            loadCallbacks(observableType, observable);
        },
        "callbacks"
    )
}
function loadDeviceInfo() {
    restRequest(
        "GET",
        "http://" + getHost() + "/info/system",
        null,
        function (response) {
            if (response) {
                this.deviceInfo = JSON.parse(response);
                processDeviceInfo();
            }
        },
        "info"
    );
    restRequest(
        "GET",
        "http://" + getHost() + "/info/actions",
        null,
        function(response) {
            if (response) {
                const actions = JSON.parse(response);
                processActions(actions);
            }
        }
    )
    restRequest(
        "GET",
        "http://" + getHost() + "/info/config",
        null,
        function(response) {
            if (response) {
                const configEntries = JSON.parse(response);
                processConfigEntries(configEntries);
                loadConfigValues();
            }
        }
    )
}
function loadCallbackTemplates() {
    restRequest(
        "GET",
        "http://" + getHost() + "/callbacks/template",
        null,
        (response) => {
            if (response) {
                const templates = JSON.parse(response);
                const defaultTemp = templates["default"] || {};
                this.callbackTemplates = Object.entries(templates)
                    .reduce((acc, [key, value]) => {
                        if (key != "default") {
                            acc[key] = {...defaultTemp, ...value};
                        }
                        return acc;
                    }, {});
                const types = Object.keys(this.callbackTemplates);
                if (!types) {
                    console.error("No callbacks templates were loaded");
                    return;
                }
                fillComboBox(document.getElementById("callback-types"), types, types[0]);
            }
        }
    )
}
function processDeviceInfo() {
    const block = document.getElementById("device-info");
    if (this.deviceInfo && block) {
        block.innerHTML = "";
        Object.entries(this.deviceInfo).forEach(([key, value]) => {
            if (key === "name") {
                createEntryInput(
                    block,
                    {
                        id: block.id + "-" + key,
                        caption: key,
                        title: "Insert new name",
                        value 
                    },
                    {
                        caption: "Save",
                        title: "Save new device name",
                        callback: () => saveNewName()
                    }
                );
            } else {
                createEntryInput(
                    block,
                    {
                        id: block.id + "-" + key,
                        caption: key,
                        value: value,
                        disabled: true
                    }
                );
            }
        });
    }
}
function saveNewName() {
    const newName = document.getElementById("device-info-name");
    if (newName && newName.value) {
        restRequest(
            "PUT",
            "http://" + getHost() + "/info",
            {name: newName.value},
            null,
            "info"
        );
    }
}
function loadWiFiSettings() {
    restRequest("GET", "http://" + getHost() + "/wifi", null,
        function (response) {
            if (response) {
                response.trim();
                const data = JSON.parse(response);
                if (data["settings"]) {
                    document.getElementById("ssid").value = data["settings"]["ss"] || "";
                    document.getElementById("password").value = data["settings"]["ps"] || "";
                    fillComboBox(document.getElementById("wifi-mode"), data["modes"], data["settings"]["md"]);
                }
            }
        },
        "wifi"
    );
}
function saveWifiSettings() {
    const ssid = document.getElementById("ssid").value;
    if (!ssid || !ssid.length) {
        document.getElementById("ssid").style.backgroundColor = red;
        return;
    }
    document.getElementById("ssid").style.backgroundColor = null;
    const pass = document.getElementById("password").value;
    const mode = document.getElementById("wifi-mode").value;
    restRequest(
        "POST",
        "http://" + getHost() + "/wifi",
        { ssid: ssid, password: pass, mode: mode },
        null,
        "wifi"
    );
}
function loadConfigValues() {
    restRequest(
        "GET",
        "http://" + getHost() + "/config",
        null,
        function (response) {
            if (response) {
                const loadedConfig = JSON.parse(response);
                if (loadedConfig) {
                    Object.keys(this.config).forEach((key) => {
                        this.config[key] = loadedConfig[key];
                        document.getElementById(key).value = loadedConfig[key];
                    });
                }
            }
        },
        "config"
    );
}
function deleteConfig() {
    if (confirm("Are you sure you want to delete ALL config values?")) {
        restRequest(
            "DELETE",
            "http://" + getHost() + "/config/delete/all",
            null,
            function(response) {
                loadConfigValues();
            },
            "config"
        )
    }
}
function saveConfig() {
    if(!this.config) {
        this.config = {};
        return;
    }

    Object.keys(this.config).forEach((key) => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'number') {
                this.config[key] = parseInt(element.value);
            } else {
                this.config[key] = element.value;
            }
        } else {
            console.error("Can't find field value for " + key);
        }
    });

    restRequest(
        "POST",
        "http://" + getHost() + "/config/add",
        Object.fromEntries(Object.entries(this.config).filter(([_, v]) => v)),
        null,
        "config"
    );
}
function deleteConfigValue(name) {
    if (name) {
        restRequest(
            "DELETE",
            "http://" + getHost() + "/config/delete?name=" + name,
            null,
            function(response) {
                document.getElementById(name).value = null;
            },
            "config"
        )
    }
}
function loadState() {
    restRequest(
        "GET",
        "http://" + getHost() + "/state",
        null,
        function (response) {
            if (response) {
                response.trim();
                document.getElementById("state").style.display = "block";
                const block = document.getElementById("state-fields-block");
                const states =  JSON.parse(response);
                if (block && states) {
                    block.innerHTML = "";
                    Object.entries(states).forEach(([key, value]) => {
                        createEntryInput(
                            block,
                            {
                                id: "state_" + key,
                                caption: key,
                                value,
                                disabled: true
                            },
                            {
                                caption: "Callbacks",
                                title: "Device state callbacks",
                                callback: () => loadCallbacks("state", key)
                            }
                        );
                    });
                }
            }
        },
        "state"
    );
}
function loadSensors() {
    restRequest(
        "GET",
        "http://" + getHost() + "/sensors",
        null,
        function (response) {
            if (response) {
                response.trim();
                document.getElementById("sensors").style.display = "block";
                const block = document.getElementById("sensors-fields-block");
                const sensors = JSON.parse(response);
                if (block && sensors) {
                    block.innerHTML = "";
                    Object.entries(sensors).forEach(([key, {value, type}]) => {
                        createEntryInput(
                            block,
                            {
                                id: "sensor_" + key,
                                caption: key,
                                value,
                                disabled: true
                            },
                            {
                                caption: "Callbacks",
                                title: "Sensors callbacks",
                                callback: () => loadCallbacks("sensor", key)
                            }
                        );
                    });
                }
            }
        },
        "sensors"
    );
}
function processActions(actions) {
    if (actions) {
        document.getElementById("actions").style.display = "block";
        const actionsBlock = document.getElementById("control-buttons-block");
        Object.entries(actions).forEach(([action, caption]) => {
            const button = document.createElement("button");
            button.onclick = function() {
                if (action || action == 0) {
                    restRequest("PUT", "http://" + getHost() + "/action?action=" + action, null, null, "actions");
                } else {
                    console.error("Action is missing!");
                }
            };
            button.innerHTML = caption;
            actionsBlock.appendChild(button);
        });
    }
}
function processConfigEntries(configFields) {
    if (configFields) {
        document.getElementById("config").style.display = "block";
        const configFieldsBlock = document.getElementById("config-fields-block");
        Object.entries(configFields).forEach(([name, {caption, type}]) => {
            this.config[name] = null;
            const p = document.createElement("p");
            p.innerHTML = caption;
            p.for = name;
            const input = document.createElement("input");
            input.type = type;
            input.id = name;
            const button = document.createElement("button");
            button.innerHTML = "X";
            button.title = "Clear config value";
            button.style.backgroundColor = "rgb(175, 53, 53)";
            button.onclick = function () {
                deleteConfigValue(name);
            };
            const div = document.createElement("div");
            div.className = "config-block";
            div.appendChild(input);
            div.appendChild(button);
            configFieldsBlock.appendChild(p);
            configFieldsBlock.appendChild(div);
        });
    }
}
function restart() {
    restRequest("PUT", "http://" + getHost() + "/restart");
}
function displayBlockInfo(blockId, visible=true, text="loading", color="#04AA6D") {
    const block = document.getElementById(blockId);
    if (block) {
        const loadingInfos = block.getElementsByClassName("loading-info");
        if (loadingInfos) {
            Array.from(loadingInfos).forEach(l => {
                l.style.display = visible ? "block" : "none";
                l.innerHTML = text;
                l.style.backgroundColor = color;
            });
        }
    }
}
function restRequest(method, path, data, callback, blockId) {
    if (blockId) displayBlockInfo(blockId);
    let xhr = new XMLHttpRequest();
    xhr.open(method, path);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 ){
                if (xhr.status >= 200 && xhr.status <= 299) {
                    if (callback) {
                        try {
                            callback(xhr.response);
                        } catch (exception) {
                            console.error("Callback failed for " + path, exception);
                        }
                    }
                    if (blockId) displayBlockInfo(blockId, false);
                } else {
                    console.error("Request " + path + " failed with code " + xhr.status);
                    if (blockId) displayBlockInfo(blockId, true, "Failed", "rgb(175, 53, 53)");
                }
            }
        };
    xhr.send(data ? JSON.stringify(data) : null);
}
/*
inputInfo: {id, caption, title, value, values, disabled}
buttonInfo: {caption, title, callback, bgrColor}
*/
function createEntryInput(container, inputInfo, buttonInfo) {
    const p = document.createElement("p");
    p.innerHTML = inputInfo.caption;
    container.appendChild(p);
    let input = null;
    if (inputInfo.values) {
        input = document.createElement("select")
        fillComboBox(input, inputInfo.values, inputInfo.value || inputInfo.default);
    } else {
        input = document.createElement("input")
        input.value = inputInfo.value;
    }
    input.id = inputInfo.id;
    input.disabled = inputInfo.disabled || false;
    if (buttonInfo && buttonInfo.callback) {
        input.title = inputInfo.title;
        const button = document.createElement("button");
        button.style.backgroundColor = buttonInfo.bgrColor || "#04AA6D";
        button.innerHTML = buttonInfo.caption;
        button.title = buttonInfo.title;
        button.onclick = buttonInfo.callback;
        const div = document.createElement("div");
        div.className = "config-block";
        div.appendChild(input);
        div.appendChild(button);
        container.appendChild(div);
    } else {
        container.appendChild(input);
    }
}
function fillComboBox(combobox, values, selectedValue) {
    if (!values) {
        return;
    }
    if (combobox) {
        combobox.innerHTML = "";
        let valuesArray;
        if (Array.isArray(values)) {
            valuesArray = values;
        } else if (typeof values == "object") {
            valuesArray = Object.entries(values);
        } else {
            console.error("Bad value data type: " + typeof values);
            return;
        }
        valuesArray.forEach((data) => {
            console.log(data);
            const option = document.createElement("option");
            if (typeof data == "string" || typeof data == "boolean") {
                option.innerHTML = data;
                option.value = data;
            } else {
                const [value, caption] = data;
                option.innerHTML = caption;
                option.value = value;
            }
            combobox.appendChild(option);
        });
        if (selectedValue) {
            combobox.value = selectedValue;
        }
    }
}
function getHost() {
    // const { host } = window.location;
    // return host;
    return "192.168.2.2";
}