import { LobbyUsersManager } from "../../lobby/LobbyUsersManager";
// import { logEmit } from "../../utils/index";
// import Server from "../../types/classes/server";
import log from '../../private-module/PrivateLogger'

export function lobbyUserEventsListener(socket: SocketIO.Socket) {
  socket.on("lobbyUser:createNewLobbyUser", (pseudo?: string) => {
    log.info(
      `Socket with id ${socket.id} want to create a lobby user with ${pseudo ? "pseudo: " + pseudo : "no pseudo chosen"}.`
    );
    LobbyUsersManager.getInstance().createLobbyUser(socket, pseudo);
  });

  socket.on("disconnect", () => {
    log.info(`User with id ${socket.id} unexpectedly deconnected from client. That's so sad... :'/`)
    LobbyUsersManager.getInstance().removeLobbyUser(socket)
  })
}
