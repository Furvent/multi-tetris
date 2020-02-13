import { LobbiesManager } from "../../types/classes/LobbiesManager";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";

export function lobbyEventsListener(socket: SocketIO.Socket) {
  socket.on("lobby:createNewLobby", (roomName: string) => {
    console.log(
      `Player with socket's id ${socket.id} want to create a new lobby with name: ${roomName}`
    );
    LobbiesManager.getInstance().playerCreateLobby(socket, roomName);
  });

  socket.on("lobby:joinLobbyWithId", id => {
    console.log(
      `Player with socket's id ${socket.id} want to join lobby with id ${id}`
    );
    LobbiesManager.getInstance().playerJoinLobbyWithId(id, socket);
  });

  socket.on("lobby:getLobbies", () => {
    console.log(`Player with socket's id ${socket.id} asked lobbies`);
    LobbiesManager.getInstance().playerAskPublicLobbies(socket)
  });
}

/**
 * TODO(BIG): Rework the project structure, because the event emit on all clients, including clients already playing
 */
export function emitCreateNewLobby(
  socket: SocketIO.Socket,
  newLobby: PayloadPublicLobby
) {
  socket.broadcast.emit("lobby:newLobbyCreated", newLobby);
}

export function emitUpdatePrivateLobbyData(
  socket: SocketIO.Socket,
  lobbyData: PayloadPrivateLobby,
  socketRoomName: string
) {
  socket.to(socketRoomName).emit("lobby:newPlayerAdded", lobbyData);
}

export function emitPublicLobbies(
  socket: SocketIO.Socket,
  lobbies: PayloadPublicLobby[]
) {
  socket.emit("lobby:allLobbies", lobbies)
}
