import { TetrisPlayer } from "./TetrisPlayer";
import { Tetromino } from "./Tetromino";

/**
 * Use to place a new tetronimo on the board
 * @param player
 */
export function placeNewTetromino(
  player: TetrisPlayer,
  boardDimension: BoardDimension
): void {
  const tetromino = player.board.currentTetrominoOnBoard;
  if (!tetromino) {
    throw `Current tetromino in player's board is null`;
  }
  // Determinate the top left corner of tetromino area (see TetrominoBlueprint to get explanation)
  // It depends to the board dimension
  const tetrominoAreaTopLeftPositionOnBoard =
    Math.round(boardDimension.width / 2 - tetromino.blueprint.side / 2) + 1;
}

export function placeTetrominoOnBoardAtPos(tetromino: Tetromino, position: number) {
  tetromino.blueprint.shapes[tetromino.currentDirection]
}

export type BoardDimension = {
  width: number;
  height: number;
};
