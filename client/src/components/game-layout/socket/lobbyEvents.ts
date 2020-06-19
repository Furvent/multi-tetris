import { PayloadPublicLobby } from "../../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../../share/types/PayloadPrivateLobby";
import { PayloadLobbyUserAvailability } from "../../../../../share/types/PayloadLobbyUserAvailability";
import { logEmit, logListener } from "@/utils";
import { Store } from "vuex";
import { State } from "../tetris/store/lobby-tetris-store";

/**
 * The type Store<State> is maybe a wrong way to handle vuex's store with typescript
 */
export function loadLobbyEventsListener(
  socket: SocketIOClient.Socket,
  store: Store<State>,
  debug: boolean
): void {
  socket.on(
    "lobby:updatedPrivateLobby",
    (updatedPrivateLobby: PayloadPrivateLobby) => {
      if (debug) {
        logListener("lobby:updatedPrivateLobby", updatedPrivateLobby);
      }
      store.commit("setPrivateLobby", updatedPrivateLobby);
    }
  );

  socket.on("lobby:allLobbies", (lobbies: PayloadPublicLobby[]) => {
    if (debug) {
      logListener("lobby:allLobbies", lobbies);
    }
    store.commit("setPublicLobbies", lobbies);
  });
}

export function emitCreateNewLobby(
  socket: SocketIOClient.Socket,
  newLobbyName: string
): void {
  const eventName = "lobby:createNewLobby";
  socket.emit(eventName, newLobbyName);
  logEmit(eventName, newLobbyName);
}

export function emitGetLobbies(socket: SocketIOClient.Socket): void {
  const eventName = "lobby:getLobbies";
  socket.emit(eventName);
  logEmit(eventName);
}

export function emitChangeLobbyUserAvailabilityInPrivateLobby(
  socket: SocketIOClient.Socket,
  payload: PayloadLobbyUserAvailability
): void {
  const eventName = "lobby:changeLobbyUserAvailability";
  socket.emit(eventName, payload);
  logEmit(eventName, payload);
}

export function emitJoinLobby(
  socket: SocketIOClient.Socket,
  lobbyId: number
): void {
  const eventName = "lobby:joinLobbyWithId";
  socket.emit(eventName, lobbyId);
  logEmit(eventName, lobbyId);
}

export function emitLeavePrivateLobby(socket: SocketIOClient.Socket) {
  const eventName = "lobby:userLeavePrivateLobby";
  socket.emit(eventName);
  logEmit(eventName);
}
