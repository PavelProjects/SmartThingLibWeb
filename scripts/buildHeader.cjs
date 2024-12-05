const fs = require("fs")
const pakage = require("../package.json")

const DIST_FOLDER = "./dist/"
const RESULT_PATH = DIST_FOLDER + "WebPageAssets.h"

const PLACEHOLDERS = {
  INDEX: ["index.html", "{INDEX}"],
  STYLES: ["assets/styles.css", "{STYLES}"],
  SCRIPT: ["assets/script.js", "{SCRIPT}"],
  ACTIONS: ["actions/script.js", "{ACTIONS}"],
  SENSORS: ["sensors/script.js", "{SENSORS}"],
  HOOKS: ["hooks/script.js", "{HOOKS}"],
  MINIMAL_INDEX: ["minimal/index.html", "{MINIMAL_INDEX}"],
  MINIMAL_SCRIPT: ["minimal/script.js", "{MINIMAL_SCRIPT}"],
}

const HEADER_TEMPLATE = `
#ifndef WEB_ASSETS_H
#define WEB_ASSETS_H

/*
  Build version: ${pakage.version}
  Build date: ${new Date().toISOString()}
*/

#include "Features.h"
#if ENABLE_WEB_PAGE 
const char* WEB_PAGE_MAIN = R"=====(${PLACEHOLDERS.INDEX[1]})=====";

const char* STYLE_PAGE_MAIN = R"=====(${PLACEHOLDERS.STYLES[1]})=====";

const char* SCRIPT_PAGE_MAIN = R"=====(${PLACEHOLDERS.SCRIPT[1]})=====";

const char* SCRIPT_ACTIONS_TAB = R"=====(${PLACEHOLDERS.ACTIONS[1]})=====";

const char* SCRIPT_SENSORS_TAB = R"=====(${PLACEHOLDERS.SENSORS[1]})=====";

const char* SCRIPT_HOOKS_TAB = R"=====(${PLACEHOLDERS.HOOKS[1]})=====";
#else
const char* WEB_PAGE_MAIN = R"=====(${PLACEHOLDERS.MINIMAL_INDEX[1]})=====";

const char* SCRIPT_PAGE_MAIN = R"=====(${PLACEHOLDERS.MINIMAL_SCRIPT[1]})=====";
#endif

#endif`;

function generateHeader() {
  let result = HEADER_TEMPLATE;
  for (const [filePath, placeholder] of Object.values(PLACEHOLDERS)) {
    const data = fs.readFileSync(DIST_FOLDER + filePath).toString();
    result = result.replace(placeholder, data.trim())
  }
  fs.writeFileSync(RESULT_PATH, result)
  console.info("Created header file with web assets: " + RESULT_PATH)
}

generateHeader()