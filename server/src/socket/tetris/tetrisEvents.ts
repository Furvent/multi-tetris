import Server from "../../classes/classes/server";

import { logEmit } from "../../utils/index";
import log from '../../private-module/PrivateLogger'
import { TetrisGameData } from "../../../../share/types/tetris/tetrisGameData";
import { PartiesManager } from "../../classes/classes/party/PartiesManager";

export function tetrisEventsListener(socket: SocketIO.Socket) {
  // socket.on()
  socket.on("tetris:clientLoadedGame", () => {
    log.info(`Player with socket's id ${socket.id} informs that he has loaded the game`)
    PartiesManager.getInstance().playerLoadedTheGame(socket);
  })
}

export function emitAskClientToLoadGame(socketIORoomName: string): void {
  const eventName = "tetris:askClientToLoadGame";
  logEmit(eventName, "no-payload", socketIORoomName);
  Server.io.to(socketIORoomName).emit(eventName);
}

export function emitTetrisGameData(socket: SocketIO.Socket, gameData: TetrisGameData): void {
  const eventName = "tetris:gameData";
  logEmit(eventName, gameData);
  socket.emit(eventName, gameData);
}