import { logEmit } from "@/utils";

export function emitCreateNewPlayer(
  socket: SocketIOClient.Socket,
  pseudo: string
): void {
  const eventName = "player:createNewPlayer";
  socket.emit(eventName, pseudo);
  logEmit(eventName, pseudo);
}