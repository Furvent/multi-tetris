import { Response, Request } from "express";
import Http from "http";
import fs from "fs";
import SocketIo from "socket.io";

import Express from "express";

import loadServerEvents from "../../socket/server/index";
import { loadLobbyEventsListener } from "../../socket/lobbies-manager";
import { loadPlayerEventsListener } from "../../socket/players-manager";
import { LobbiesManager } from "./LobbiesManager";
import log from "../../private-module/PrivateLogger";
import { PlayersManager } from "./PlayersManager";

// TODO: Create Party Manager
export default class Server {
  public static io: SocketIO.Server;

  constructor() {}

  public start(): void {
    this.loadConfig();
    this.initManagers();
    const app = Express();
    const serverHttp = Http.createServer(app);
    Server.io = SocketIo(serverHttp);
    app.get("/status", (req: Request, res: Response) => {
      res.send("Server running");
    });
    serverHttp.listen(global.globalConfig.port, () => {
      log.info(`Server launch on port:${global.globalConfig.port}`);
    });
    Server.io.on("connect", (socket) => {
      log.info(`Connected client with id ${socket.id}`);
      loadServerEvents(socket);
      loadLobbyEventsListener(socket);
      loadPlayerEventsListener(socket);
    });
  }

  private loadConfig(): void {
    try {
      global.globalConfig = JSON.parse(
        fs
          .readFileSync(__dirname + "/../../../../config/server-config.json")
          .toString()
      );
    } catch (error) {
      log.error(`Problem when loading global config:, ${error}`);
      log.error("Server will stop now, can't load config file");
      process.exit();
    }
  }

  // Managers = controllers
  private initManagers() {
    LobbiesManager.getInstance();
    PlayersManager.getInstance();
  }
}
