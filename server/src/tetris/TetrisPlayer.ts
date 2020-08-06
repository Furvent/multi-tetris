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
  private _board: TetrisGameBoard;

  constructor(
    playerFromLobby: LobbyUser,
    gameId: number,
    tetrominosConfig: TetrominoBlueprint[],
    tetrominoMovementTimer: number
  ) {
    super(playerFromLobby, gameId);
    this.tetrominosConfig = tetrominosConfig;
    this._board = new TetrisGameBoard(this.tetrominosConfig, tetrominoMovementTimer);
  }

  get board(): TetrisGameBoard {
    return this._board;
  }

  public haveNoTetrominoOnBoard(): boolean {
    return !this._board.currentTetrominoOnBoard;
  }

  public isTetrominoSequenceEmpty(): boolean {
    return this._board.tetrominosSequence.length <= 0
  }

  public exportPrivateGameData(): TetrisPrivatePlayerGameData {
    return {
      ...this.exportPublicGameData(),
      isDisconnected: this.isDisconnected,
    };
  }

  public exportPublicGameData(): TetrisPublicPlayerGameData {
    return {
      gameId: this.gameId,
      pseudo: this.pseudo,
    };
  }
}
