import { LobbiesManager } from "../../types/classes/LobbiesManager";
import { PayloadPublicLobby } from "../../../../share/interfaces/PayloadPublicLobby";

export function lobbyEventsListener(socket: SocketIO.Socket) {
  socket.on("lobby:createNewLobby", () => {
    console.log(
      `User with socket's id ${socket.id} want to create a new lobby`
    );
    LobbiesManager.getInstance().userCreateLobby(socket);
  });

  socket.on("lobby:joinLobbyWithId", id => {
    console.log(
      `User with socket's id ${socket.id} want to join lobby with id ${id}`
    );
    LobbiesManager.getInstance().userJoinLobbyWithId(id, socket);
  });
}

/**
 * TODO(BIG): Rework the project structure, because the event emit on all clients, including clients already playing
 * @param socket
 * @param newLobby 
 */
export function emitCreateNewLobby(
  socket: SocketIO.Socket,
  newLobby: PayloadPublicLobby
) {
    socket.emit('lobby:newLobbyCreated', newLobby)
}
