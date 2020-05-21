import { PlayersManager } from "../../types/classes/PlayersManager";
// import { logEmit } from "../../utils/index";
// import Server from "../../types/classes/server";
import log from '../../private-module/PrivateLogger'

export function playerEventsListener(socket: SocketIO.Socket) {
  socket.on("player:createNewPlayer", (pseudo?: string) => {
    log.info(
      `Socket with id ${socket.id} want to create a player with ${pseudo ? "pseudo: " + pseudo : "no pseudo chosen"}.`
    );
    PlayersManager.getInstance().createPlayer(socket, pseudo);
  });

  socket.on("disconnect", () => {
    log.info(`Player with id ${socket.id} unexpectedly deconnected from client. That's so sad... :'/`)
    PlayersManager.getInstance().removePlayer(socket)
  })
}
