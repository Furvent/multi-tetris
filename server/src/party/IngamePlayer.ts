import { LobbyUser } from "../lobby/LobbyUser";
import { PlayerInput } from "../tetris/enums";

export abstract class IngamePlayer {
  hasLoadedGame: boolean;
  isDisconnected: boolean;
  private _gameId: number; //ID in the party itself (like player 1, 2 etc)
  private _pseudo: string;
  private _socket: SocketIO.Socket;
  private _input: PlayerInput;

  constructor(playerFromLobby: LobbyUser, gameId: number) {
    this.hasLoadedGame = false;
    this.isDisconnected = false;
    this._pseudo = playerFromLobby.pseudo;
    this._socket = playerFromLobby.socket;
    this._gameId = gameId;
    this._input = PlayerInput.NONE;
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

  get input(): PlayerInput {
    return this._input;
  }

  set input(newInput: PlayerInput) {
    this._input = newInput;
  }

  abstract exportPrivateGameData();
  abstract exportPublicGameData();
}