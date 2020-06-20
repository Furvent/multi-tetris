export interface GlobalConfig {
  port: number;
  privateLogger: {
    error: boolean,
    info: boolean,
    highlight: boolean,
    debug: boolean
  };
}
