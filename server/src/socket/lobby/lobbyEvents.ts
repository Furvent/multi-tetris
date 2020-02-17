import { LobbiesManager } from "../../types/classes/LobbiesManager";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";
import { PayloadPlayerAvailability } from "../../../../share/types/PayloadPlayerAvailability";
import { logEmit } from "./../../utils/index";
import Server from "../../types/classes/server";

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
    LobbiesManager.getInstance().playerAskPublicLobbies(socket);
  });

  socket.on(
    "lobby:changePlayerAvailability",
    (payload: PayloadPlayerAvailability) => {
      console.log(
        `Player with socket's id ${socket.id} changed his availability in loby ${payload.lobbyId}`
      );
      LobbiesManager.getInstance().playerChangeAvailabiltyStatusInPrivateLobby(
        socket,
        payload.lobbyId,
        payload.availability
      );
    }
  );
}

/**
 * TODO(BIG): Rework the project structure, because the event emit on all clients, including clients already playing
 * For now, this event is not used
 */
export function emitCreateNewLobby(
  socket: SocketIO.Socket,
  newLobby: PayloadPublicLobby
) {
  const eventName = "lobby:newLobbyCreated";
  logEmit(eventName, newLobby);
  socket.broadcast.emit(eventName, newLobby);
}

export function emitUpdatePrivateLobbyData(
  lobbyData: PayloadPrivateLobby,
  socketRoomName: string
) {
  const eventName = "lobby:updatedPrivateLobby";
  logEmit(eventName, lobbyData, socketRoomName);
  Server.io.to(socketRoomName).emit(eventName, lobbyData);
}

export function emitPublicLobbies(
  socket: SocketIO.Socket,
  lobbies: PayloadPublicLobby[]
) {
  const eventName = "lobby:allLobbies";
  logEmit(eventName, lobbies);
  socket.emit(eventName, lobbies);
}
