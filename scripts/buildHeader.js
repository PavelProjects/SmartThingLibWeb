const fs = require("fs")

const DIST_FOLDER = "./dist/"
const RESULT_PATH = DIST_FOLDER + "WebPageAssets.h"

const PLACEHOLDERS = {
  INDEX: ["index.html", "{INDEX}"],
  STYLES: ["assets/styles.css", "{STYLES}"],
  SCRIPT: ["assets/script.js", "{SCRIPT}"]
}

const HEADER_TEMPLATE = `
#include "Features.h"
#if ENABLE_WEB_PAGE 
const char* WEB_PAGE_MAIN PROGMEM = R"=====(${PLACEHOLDERS.INDEX[1]})=====";

const char* STYLE_PAGE_MAIN PROGMEM = R"=====(${PLACEHOLDERS.STYLES[1]})=====";

const char* SCRIPT_PAGE_MAIN PROGMEM = R"=====(${PLACEHOLDERS.SCRIPT[1]})=====";
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