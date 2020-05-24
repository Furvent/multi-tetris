import { tetrisEventsListener } from "./tetrisEvents";

export function loadTetrisEventsListener(socket: SocketIO.Socket): void {
  tetrisEventsListener(socket);
}

export { emitAskClientToLoadGame, emitTetrisGameData } from "./tetrisEvents"
