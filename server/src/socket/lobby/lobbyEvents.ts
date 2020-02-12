import { LobbiesManager } from "../../types/classes/LobbiesManager";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";

export function lobbyEventsListener(socket: SocketIO.Socket) {
  socket.on("lobby:createNewLobby", () => {
    console.log(
      `User with socket's id ${socket.id} want to create a new lobby`
    );
    LobbiesManager.getInstance().playerCreateLobby(socket);
  });

  socket.on("lobby:joinLobbyWithId", id => {
    console.log(
      `User with socket's id ${socket.id} want to join lobby with id ${id}`
    );
    LobbiesManager.getInstance().playerJoinLobbyWithId(id, socket);
  });
}

/**
 * TODO(BIG): Rework the project structure, because the event emit on all clients, including clients already playing
 */
export function emitCreateNewLobby(
  socket: SocketIO.Socket,
  newLobby: PayloadPublicLobby
) {
  socket.emit("lobby:newLobbyCreated", newLobby);
}

export function emitUpdatePrivateLobbyData(
  socket: SocketIO.Socket,
  lobbyData: PayloadPrivateLobby,
  socketRoomName: string
) {
  socket.to(socketRoomName).emit("lobby:newPlayerAdded", lobbyData);
}
