import { IngamePlayer } from "../party/IngamePlayer";
import { LobbyUser } from "../lobby/LobbyUser";
import { TetrisPrivatePlayerGameData } from "../../../share/types/tetris/tetrisPrivatePlayerGameData";
import { TetrisPublicPlayerGameData } from "../../../share/types/tetris/tetrisPublicPlayerGameData";
import { TetrominoBlueprint } from "./Tetromino";
import { TetrisGameBoard } from "./TetrisGameBoard";

/**
 * TODO : remove ref to tetrominos config if unused at the end, just dispatch it to board
 */
export class TetrisPlayer extends IngamePlayer {
  private tetrominosConfig: TetrominoBlueprint[];
  private _playerBoard: TetrisGameBoard;

  constructor(
    playerFromLobby: LobbyUser,
    gameId: number,
    tetrominosConfig: TetrominoBlueprint[]
  ) {
    super(playerFromLobby, gameId);
    this.tetrominosConfig = tetrominosConfig;
    this._playerBoard = new TetrisGameBoard(this.tetrominosConfig);
  }

  exportPrivateGameData(): TetrisPrivatePlayerGameData {
    return {
      ...this.exportPublicGameData(),
      isDisconnected: this.isDisconnected,
    };
  }

  exportPublicGameData(): TetrisPublicPlayerGameData {
    return {
      gameId: this.gameId,
      pseudo: this.pseudo,
    };
  }

  get playerBoard(): TetrisGameBoard {
    return this._playerBoard;
  }
}
