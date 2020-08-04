/**
 * An Tetris grid is 10 cells width and 22 cells height. Means it's 220 cells numbered 1 to 220, from left top to right bottom.
 */
export class TetrisGameBoard {
  /**
   * Array use to store cells occupied by static tetronimo, those already positionned at the bottom of the board.
   */
  private occupiedCells: Number[];

  constructor() {
    this.occupiedCells = [];
  }

  /**
   * Loop call by the party
   */
  public updateLoop() {

  }
}