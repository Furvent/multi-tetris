import { createLobbyEvent } from "./lobbyEvents";

export default function loadLobbyEvents(socket: SocketIO.Socket) {
    createLobbyEvent(socket);
}