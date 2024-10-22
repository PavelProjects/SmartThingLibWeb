const fs = require("fs")

const DIST_FOLDER = "./dist/"
const RESULT_PATH = DIST_FOLDER + "WebPageAssets.h"

const PLACEHOLDERS = {
  INDEX: ["index.html", "{INDEX}"],
  STYLES: ["assets/styles.css", "{STYLES}"],
  SCRIPT: ["assets/script.js", "{SCRIPT}"],
  ACTIONS: ["actions/script.js", "{ACTIONS}"],
  SENSORS: ["sensors/script.js", "{SENSORS}"],
  STATES: ["states/script.js", "{STATES}"],
  HOOKS: ["hooks/script.js", "{HOOKS}"],
}

const HEADER_TEMPLATE = `
#include "Features.h"
#if ENABLE_WEB_PAGE 
const char* WEB_PAGE_MAIN PROGMEM = R"=====(${PLACEHOLDERS.INDEX[1]})=====";

const char* STYLE_PAGE_MAIN PROGMEM = R"=====(${PLACEHOLDERS.STYLES[1]})=====";

const char* SCRIPT_PAGE_MAIN PROGMEM = R"=====(${PLACEHOLDERS.SCRIPT[1]})=====";

const char* SCRIPT_ACTIONS_TAB = R"=====(${PLACEHOLDERS.ACTIONS[1]})=====";

const char* SCRIPT_SENSORS_TAB = R"=====(${PLACEHOLDERS.SENSORS[1]})=====";

const char* SCRIPT_STATES_TAB = R"=====(${PLACEHOLDERS.STATES[1]})=====";

const char* SCRIPT_HOOKS_TAB = R"=====(${PLACEHOLDERS.HOOKS[1]})=====";
#endif
`;

function generateHeader() {
  let result = HEADER_TEMPLATE;
  for (const [filePath, placeholder] of Object.values(PLACEHOLDERS)) {
    const data = fs.readFileSync(DIST_FOLDER + filePath).toString();
    result = result.replace(placeholder, data)
  }
  fs.writeFileSync(RESULT_PATH, result)
  console.info("Created header file with web assets: " + RESULT_PATH)
}

generateHeader()