import Server from "../../types/classes/server";

import { logEmit } from "../../utils/index";
import log from '../../private-module/PrivateLogger'

export function tetrisEventsListener(socket: SocketIO.Socket) {
  // socket.on()
}

export function emitAskClientToLoadGame(socketIORoomName: string): void {
  const eventName = "tetris:askClientToLoadGame";
  logEmit(eventName, "no-payload", socketIORoomName);
  Server.io.to(socketIORoomName).emit(eventName);
}