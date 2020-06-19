import { GlobalConfig } from "./config";

export {}

declare global {
    namespace NodeJS {
        interface Global {
            bob:string;
            globalConfig: GlobalConfig
        }
    }
}
