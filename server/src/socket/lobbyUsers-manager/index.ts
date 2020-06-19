import { lobbyUserEventsListener } from "./lobbyUserEvents";

export function loadLobbyUserEventsListener(socket: SocketIO.Socket) {
  lobbyUserEventsListener(socket);
}