import { LobbiesManager } from "../../lobby/LobbiesManager";
import { PayloadPublicLobby } from "../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../share/types/PayloadPrivateLobby";
import { PayloadLobbyUserAvailability } from "../../../../share/types/PayloadLobbyUserAvailability";
import { logEmit } from "../../utils/index";
import Server from "../../server";
import log from '../../private-module/PrivateLogger'

export function lobbyEventsListener(socket: SocketIO.Socket) {
  socket.on("lobby:createNewLobby", (roomName?: string) => {
    log.info(
      `LobbyUser with socket's id ${socket.id} want to create a new lobby with name: ${roomName}`
    );
    LobbiesManager.getInstance().lobbyUserCreateLobby(socket, roomName);
  });

  socket.on("lobby:joinLobbyWithId", id => {
    log.info(
      `LobbyUser with socket's id ${socket.id} want to join lobby with id ${id}`
    );
    LobbiesManager.getInstance().lobbyUserJoinLobbyWithId(id, socket);
  });

  socket.on("lobby:getLobbies", () => {
    log.info(`LobbyUser with socket's id ${socket.id} asked lobbies`);
    LobbiesManager.getInstance().lobbyUserAskPublicLobbies(socket);
  });

  socket.on(
    "lobby:changeLobbyUserAvailability",
    (payload: PayloadLobbyUserAvailability) => {
      log.info(
        `LobbyUser with socket's id ${socket.id} changed his availability in loby ${payload.lobbyId}`
      );
      LobbiesManager.getInstance().lobbyUserChangeAvailabiltyStatusInPrivateLobby(
        socket,
        payload.lobbyId,
        payload.availability
      );
    }
  );

  socket.on("lobby:userLeavePrivateLobby", () => {
    log.info(`LobbyUser with id ${socket.id} want to leave his private lobby`)
    LobbiesManager.getInstance().lobbyUserLeavePrivateLobby(socket)
  })

  socket.on("disconnect", () => {
    log.info(`LobbyUser with id ${socket.id} unexpectedly deconnected from client lobby area. That's so sad... :'/`)
    LobbiesManager.getInstance().lobbyUserDeconnectedFromClient(socket)
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
