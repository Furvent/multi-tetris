export class Player {
    id: string
    socket: SocketIO.Socket

    constructor(socket: SocketIO.Socket) {
        this.id = socket.id
        this.socket = socket
    }
}