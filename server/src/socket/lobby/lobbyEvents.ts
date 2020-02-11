import { LobbiesManager } from "../../types/classes/LobbiesManager"

export function createLobbyEvent(socket: SocketIO.Socket) {
    /**
     * Create a lobby, add the player to it, and make him join the lobby's socket room
     */
    socket.on('lobby:createNewLobby', () => {
        console.log(`User with socket's id ${socket.id} want to create a new lobby`)
        LobbiesManager.getInstance().userCreateLobby(socket)
    })

    socket.on('lobby:joinLobbyWithId', (id) => {
        console.log(`User with socket's id ${socket.id} want to join lobby with id ${id}`)
        LobbiesManager.getInstance().userJoinLobbyWithId(id, socket)
    })
}