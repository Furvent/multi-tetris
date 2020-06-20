import { TetrisGameData } from "../../../../../../share/types/tetris/tetrisGameData";

import { logEmit, logListener } from "@/utils";
import { Store } from "vuex";
import { StateParty } from "../store/party-tetris-store";

/**
 * The type Store<State> is maybe a wrong way to handle vuex's store with typescript
 */
export function loadTetrisPartyEventsListener(
  socket: SocketIOClient.Socket,
  store: Store<StateParty>,
  debug: boolean
): void {
  socket.on("tetris:gameData", (gameData: TetrisGameData) => {
    if (debug) {
      logListener("tetris:gameData", gameData);
    }
    store.commit("")
  });
}

export function emitClientLoadedGame(
  socket: SocketIOClient.Socket,
): void {
  const eventName = "tetris:clientLoadedGame";
  socket.emit(eventName);
  logEmit(eventName);
}
