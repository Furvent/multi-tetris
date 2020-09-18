import Server from "../../server";

import { logEmit } from "../../utils/index";
import log from "../../private-module/PrivateLogger";
import { TetrisGameData, InitTetrisPartyData } from "../../../../share/types/tetris/tetrisGameData";
import { PartiesManager } from "../../party/PartiesManager";

export function tetrisEventsListener(socket: SocketIO.Socket) {
  // socket.on()
  socket.on("tetris:clientLoadedGame", () => {
    log.info(
      `Player with socket's id ${socket.id} informs that he has loaded the game`
    );
    PartiesManager.getInstance().playerLoadedTheGame(socket);
  });
  socket.on("disconnect", () => {
    log.info(`Player IN PARTY with socket's id ${socket.id} disconnected `);
    PartiesManager.getInstance().playerDisconnected(socket);
  })
}

export function emitAskClientToLoadGame(socket: SocketIO.Socket, payload: InitTetrisPartyData): void {
  const eventName = "tetris:askClientToLoadGame";
  logEmit(eventName, payload);
  socket.emit(eventName, payload);
}

export function emitTetrisGameData(
  socket: SocketIO.Socket,
  gameData: TetrisGameData
): void {
  const eventName = "tetris:gameData";
  logEmit(eventName, gameData);
  socket.emit(eventName, gameData);
}
