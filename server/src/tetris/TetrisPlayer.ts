import { IngamePlayer } from "../party/IngamePlayer";
import { LobbyUser } from "../lobby/LobbyUser";
import { TetrisPrivatePlayerGameData } from "../../../share/types/tetris/tetrisPrivatePlayerGameData";
import { TetrisPublicPlayerGameData } from "../../../share/types/tetris/tetrisPublicPlayerGameData";
import { TetrominoBlueprint } from "./Tetromino";
import { TetrisGameBoard } from "./TetrisGameBoard";

export class TetrisPlayer extends IngamePlayer {
  private _board: TetrisGameBoard;

  constructor(
    playerFromLobby: LobbyUser,
    gameId: number,
    tetrominosConfig: TetrominoBlueprint[],
    tetrominoMovementTimer: number
  ) {
    super(playerFromLobby, gameId);
    this._board = new TetrisGameBoard(tetrominosConfig, tetrominoMovementTimer);
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
