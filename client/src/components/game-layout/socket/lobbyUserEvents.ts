import { logEmit } from "@/utils";

export function emitCreateNewLobbyUser(
  socket: SocketIOClient.Socket,
  pseudo: string
): void {
  const eventName = "lobbyUser:createNewLobbyUser";
  socket.emit(eventName, pseudo);
  logEmit(eventName, pseudo);
}