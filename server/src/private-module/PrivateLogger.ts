import colors from "colors";

export default {
    error: (message: string) => console.error(colors.red.bgWhite(message)),
    info: (message: string) => console.log(colors.blue(message)),
    highlight: (message: string) => console.log(colors.green(message)),
    debug: (message: string) => console.log(colors.yellow(message))
  }
