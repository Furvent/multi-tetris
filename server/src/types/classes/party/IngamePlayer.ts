import { Player } from "../Player";

export abstract class IngamePlayer {
  hasLoadedGame: boolean;
  isDisconnected: boolean;
  pseudo: string;
  socket: SocketIO.Socket;

  constructor(playerFromLobby: Player) {
    this.hasLoadedGame = false;
    this.isDisconnected = false;
    this.pseudo = playerFromLobby.pseudo;
    this.socket = playerFromLobby.socket;
  }
}