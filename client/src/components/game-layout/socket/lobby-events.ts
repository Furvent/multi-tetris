import { PayloadPublicLobby } from "../../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from '../../../../../share/types/PayloadPrivateLobby';
import store from "../../game-layout/tetris/store/lobby-tetris-store";

export function loadLobbyEventsListener(
  socket: SocketIOClient.Socket,
  debug: boolean
) {
  socket.on("lobby:newLobbyCreated", (newPublicLobby: PayloadPublicLobby) => {
    console.error(`EventListener: newLobbyCreated is not implemented`);
  });

  socket.on("lobby:updatedPrivateLobby", (updatedPrivateLobby: PayloadPrivateLobby) => {
    if (debug) {
      console.log(
        `EventListener: lobby:updatedPrivateLobby was called with payload: ${updatedPrivateLobby}`
      );
    }
    store.state.privateLobby = updatedPrivateLobby
  })

  socket.on("lobby:allLobbies", (lobbies: PayloadPublicLobby[]) => {
    if (debug) {
      console.log(
        `EventListener: lobby:allLobbies was called with payload: ${lobbies}`
      );
    }
    store.state.publicLobbies = lobbies
  });
}
