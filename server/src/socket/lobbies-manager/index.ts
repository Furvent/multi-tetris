import { lobbyEventsListener } from "./lobbyEvents";

export function loadLobbyEventsListener(socket: SocketIO.Socket): void {
  lobbyEventsListener(socket);
}

export { emitUpdatePrivateLobby, emitPublicLobbies } from "./lobbyEvents";
