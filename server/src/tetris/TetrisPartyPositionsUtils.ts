import { Tetromino } from "./Tetromino";
import { GamePosition } from "./TetrisGameBoard";

/**
 * Use to place a new tetronimo on the board
 * @param player
 */
export function placeNewTetromino(
  newTetromino: Tetromino,
  boardDimension: BoardDimension
): void {
  // Determinate the top left corner of tetromino area (see TetrominoBlueprint to get explanation)
  // It depends to the board dimension
  const tetrominoAreaTopLeftPositionOnBoard = {
    x:
      Math.round(boardDimension.width / 2 - newTetromino.blueprint.side / 2) +
      1, // We add '1' because it's 'x' cells of space and we want the next one
    y: 1, // We want new tetromino to be at the top of the board
  };
  determinateTetrominoPositionOnBoard(
    newTetromino,
    tetrominoAreaTopLeftPositionOnBoard
  );
}

/**
 * For each tetromino cell, we determinate which position it will occuping on board
 * We can have invalid position at the end (out of the bounds), collision are handle somewhere else
 * @param tetromino
 * @param position
 */
export function determinateTetrominoPositionOnBoard(
  tetromino: Tetromino,
  tetrominoAreaOriginPosition: GamePosition
): void {
  // We find in blueprint shapes the good one, determinate by direction
  const shape = tetromino.getCurrentShape();
  tetromino.currentPosition = shape.map((shapePos) => {
    return {
      x: tetrominoAreaOriginPosition.x + shapePos.x - 1,
      y: tetrominoAreaOriginPosition.y + shapePos.y - 1,
    };
  });
}

export function moveTetrominoWithVector(
  tetromino: Tetromino,
  vector: Vector
): void {
  if (tetromino.currentPosition.length <= 0) {
    throw 'In moveTetrominoWithVector(), cannot move a tetromino if no current position'
  }
  tetromino.currentPosition = tetromino.currentPosition.map(pos => {
    return {
      x: pos.x + vector.x,
      y: pos.y + vector.y
    }
  })
}

export type BoardDimension = {
  width: number;
  height: number;
};

export type Vector = {
  x: number;
  y: number;
};
