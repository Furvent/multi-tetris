import { PayloadLobbyPlayer } from "../../../../share/types/PayloadLobbyPlayer"

export class Player {
    id: string
    pseudo: string
    socket: SocketIO.Socket
    isReadyInPrivateLobby: boolean

    constructor(socket: SocketIO.Socket) {
        this.id = socket.id
        this.pseudo = `pseudoTemp${this.id}`
        this.socket = socket
        this.isReadyInPrivateLobby = false;
        console.log(`New player created. Pseudo: ${this.pseudo}`)
    }

    exportToLobbyPlayer(): PayloadLobbyPlayer {
        return {
            pseudo: this.pseudo,
            isReady: this.isReadyInPrivateLobby
        }
    }
}