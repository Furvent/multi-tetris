import { lobbyEventsListener } from "./lobbyEvents"

export function loadLobbyEventsListener(socket: SocketIO.Socket) {
    lobbyEventsListener(socket)
}

export {emitCreateNewLobby, emitUpdatePrivateLobbyData, emitPublicLobbies} from "./lobbyEvents"