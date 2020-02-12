import { lobbyEventsListener } from "./lobbyEvents";

export function loadLobbyEventsListener(socket: SocketIO.Socket) {
    lobbyEventsListener(socket)
}

export 