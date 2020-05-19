import { LobbiesManager } from "../../types/classes/LobbiesManager";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";
import { PayloadPlayerAvailability } from "../../../../share/types/PayloadPlayerAvailability";
import { logEmit } from "../../utils/index";
import Server from "../../types/classes/server";
import log from '../../private-module/PrivateLogger'

export function lobbyEventsListener(socket: SocketIO.Socket) {
  socket.on("lobby:createNewLobby", (roomName: string) => {
    log.info(
      `Player with socket's id ${socket.id} want to create a new lobby with name: ${roomName}`
    );
    LobbiesManager.getInstance().playerCreateLobby(socket, roomName);
  });

  socket.on("lobby:joinLobbyWithId", id => {
    log.info(
      `Player with socket's id ${socket.id} want to join lobby with id ${id}`
    );
    LobbiesManager.getInstance().playerJoinLobbyWithId(id, socket);
  });

  socket.on("lobby:getLobbies", () => {
    log.info(`Player with socket's id ${socket.id} asked lobbies`);
    LobbiesManager.getInstance().playerAskPublicLobbies(socket);
  });

  socket.on(
    "lobby:changePlayerAvailability",
    (payload: PayloadPlayerAvailability) => {
      log.info(
        `Player with socket's id ${socket.id} changed his availability in loby ${payload.lobbyId}`
      );
      LobbiesManager.getInstance().playerChangeAvailabiltyStatusInPrivateLobby(
        socket,
        payload.lobbyId,
        payload.availability
      );
    }
  );

  socket.on("lobby:playerLeavePrivateLobby", () => {
    log.info(`Player with id ${socket.id} want to leave his private lobby`)
    LobbiesManager.getInstance().playerLeavePrivateLobby(socket)
  })

  socket.on("disconnect", () => {
    log.info(`Player with id ${socket.id} unexpectedly deconnected from client lobby area. That's so sad... :'/`)
    LobbiesManager.getInstance().playerDeconnectedFromClient(socket)
  })
}

export function emitUpdatePrivateLobby(
  lobbyData: PayloadPrivateLobby,
  socketIORoomName: string
) {
  const eventName = "lobby:updatedPrivateLobby";
  logEmit(eventName, lobbyData, socketIORoomName);
  Server.io.to(socketIORoomName).emit(eventName, lobbyData);
}

/**
 * @param lobbies Lobbies to send
 * @param socket Optionnal. If filled, send lobbies only to this socket
 */
export function emitPublicLobbies(
  lobbies: PayloadPublicLobby[],
  socket?: SocketIO.Socket
) {
  const eventName = "lobby:allLobbies";
  logEmit(eventName, lobbies);
  (typeof socket == "undefined") ? Server.io.emit(eventName, lobbies) : socket.emit(eventName, lobbies);
}
