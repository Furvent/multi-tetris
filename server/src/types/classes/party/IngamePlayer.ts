import { Player } from "../Player";

export abstract class IngamePlayer {
  hasLoadedGame: boolean;
  isDisconnected: boolean;
  private _pseudo: string;
  private _socket: SocketIO.Socket;

  constructor(playerFromLobby: Player) {
    this.hasLoadedGame = false;
    this.isDisconnected = false;
    this._pseudo = playerFromLobby.pseudo;
    this._socket = playerFromLobby.socket;
  }

  get pseudo(): string {
    return this._pseudo;
  }

  get socket(): SocketIO.Socket {
    return this._socket;
  }
}