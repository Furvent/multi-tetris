import { Response, Request } from "express";
import Http from "http";
import fs from "fs";
import SocketIo from "socket.io";

import Express from "express";

import * as ReceptionEvents from "./socket/reception/index";

export default class Server {

  constructor() {}

  public start():void {
    this.loadConfig();
    const app = Express();
    const serverHttp = Http.createServer(app);
    const io = SocketIo(serverHttp);
    app.get("/status", (req: Request, res: Response) => {
      res.send("Server running");
    });
    serverHttp.listen(global.globalConfig.port, () => {
      console.log(`Server launch on port:${global.globalConfig.port}`);
    });
    io.on("connect", socket => {
      console.log(`Connected client with id ${socket.id}`);
      console.log(socket);
      ReceptionEvents.loadEvents(socket);
    });
  }

  private loadConfig():void {
    try {
      global.globalConfig = JSON.parse(
        fs
          .readFileSync(__dirname + "/../../config/server-config.json")
          .toString()
      );
    } catch (error) {
        console.error("Problem when loading global config:", error)
    }
  }
}
