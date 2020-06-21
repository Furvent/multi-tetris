import colors from "colors";
const util = require('util') // To inspect objects in node's console

export default {
  error: (message: string) => {
    if (global.globalConfig.privateLogger.error) {
      console.error(colors.red.bgWhite(message));
    }
  },
  info: (message: string) => {
    if (global.globalConfig.privateLogger.info) {
      console.log(colors.blue(message));
    }
  },
  highlight: (message: string) => {
    if (global.globalConfig.privateLogger.highlight) {
      console.log(colors.green(message));
    }
  },
  debug: (message: string, objectToInspect?: any) => {
    if (global.globalConfig.privateLogger.debug) {
      console.log(colors.magenta(message), util.inspect(objectToInspect));
    }
  },
};
