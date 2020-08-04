import colors from "colors";

export default {
  error: (message: string) => {
    if (process.env.NODE_ENV === "test" || global.globalConfig.privateLogger.error) {
      console.error(colors.red.bgWhite(message));
    }
  },
  info: (message: string) => {
    if (process.env.NODE_ENV === "test" || global.globalConfig.privateLogger.info) {
      console.log(colors.blue(message));
    }
  },
  highlight: (message: string) => {
    if (process.env.NODE_ENV === "test" || global.globalConfig.privateLogger.highlight) {
      console.log(colors.green(message));
    }
  },
  debug: (message: string) => {
    if (process.env.NODE_ENV === "test" || global.globalConfig.privateLogger.debug) {
      console.log(colors.magenta(message));
    }
  },
};
