import { Player } from "../Player";

export abstract class IngamePlayer {
  hasLoadedGame: boolean;
  isDisconnected: boolean;
  private _gameId: number; //ID in the party itself (like player 1, 2 etc)
  private _pseudo: string;
  private _socket: SocketIO.Socket;

  constructor(playerFromLobby: Player, gameId: number) {
    this.hasLoadedGame = false;
    this.isDisconnected = false;
    this._pseudo = playerFromLobby.pseudo;
    this._socket = playerFromLobby.socket;
    this._gameId = gameId;
  }

  get pseudo(): string {
    return this._pseudo;
  }

  get socket(): SocketIO.Socket {
    return this._socket;
  }

  get gameId(): number {
    return this._gameId;
  }

  abstract exportPrivateGameData();
  abstract exportPublicGameData();
}