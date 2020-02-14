import { PayloadLobbyPlayer } from "../../../../share/types/PayloadLobbyPlayer"

export class Player {
    id: string
    pseudo: string
    socket: SocketIO.Socket

    constructor(socket: SocketIO.Socket) {
        this.id = socket.id
        this.pseudo = `pseudoTemp${this.id}`
        this.socket = socket
        console.log(`New player created. Pseudo: ${this.pseudo}`)
    }

    exportToLobbyPlayer(): PayloadLobbyPlayer {
        return {
            pseudo: this.pseudo
        }
    }
}