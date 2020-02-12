import { Response, Request } from "express";
import Http from "http";
import fs from "fs";
import SocketIo from "socket.io";

import Express from "express";

import loadServerEvents from "../../socket/server/index";
import {loadLobbyEventsListener} from "../../socket/lobby";
import { LobbiesManager } from "./LobbiesManager";

export default class Server {

  public static io: SocketIO.Server

  constructor() {}

  public start():void {
    this.loadConfig()
    this.initManagers()
    const app = Express()
    const serverHttp = Http.createServer(app)
    Server.io = SocketIo(serverHttp)
    app.get("/status", (req: Request, res: Response) => {
      res.send("Server running");
    });
    serverHttp.listen(global.globalConfig.port, () => {
      console.log(`Server launch on port:${global.globalConfig.port}`)
    });
    Server.io.on("connect", socket => {
      console.log(`Connected client with id ${socket.id}`)
      loadServerEvents(socket);
      loadLobbyEventsListener(socket);
    });
  }

  private loadConfig():void {
    try {
      global.globalConfig = JSON.parse(
        fs
          .readFileSync(__dirname + "/../../../../config/server-config.json")
          .toString()
      );
    } catch (error) {
        console.error("Problem when loading global config:", error)
        console.error("Server will stop now, can't load config file")
        process.exit()
    }
  }

  // Managers = controllers
  private initManagers() {
    LobbiesManager.getInstance()
  }
}
