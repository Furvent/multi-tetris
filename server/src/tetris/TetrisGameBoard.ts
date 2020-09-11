import log from "../private-module/PrivateLogger";
import { TetrominoBlueprint, Tetromino, TetrominoDirection } from "./Tetromino";
import { shuffle } from "../utils/index";

/**
 * An Tetris grid is 10 cells width and 22 cells height. Means it's 220 cells numbered 1 to 220, from left top to right bottom.
 */
export class TetrisGameBoard {
  /**
   * Array use to store cells occupied by static tetromino at the bottom of the board.
   */
  private _occupiedCells: number[];
  private _tetrominosSequence: string[];
  private _currentTetrominoOnBoard: Tetromino | null;
  private readonly tetrominosConfig: TetrominoBlueprint[];
  private readonly tetrominoMovementTimer;

  constructor(
    tetrominosConfig: TetrominoBlueprint[],
    tetrominoMovementTimer: number
  ) {
    this.tetrominosConfig = tetrominosConfig;
    this.tetrominoMovementTimer = tetrominoMovementTimer;
    this._occupiedCells = [];
    this._tetrominosSequence = [];
    this._currentTetrominoOnBoard = null;
    this.createTetrominosSequence();
  }

  get tetrominosSequence(): string[] {
    return this._tetrominosSequence;
  }

  get occupiedCells(): number[] {
    return this._occupiedCells;
  }

  get currentTetrominoOnBoard(): Tetromino | null {
    return this._currentTetrominoOnBoard;
  }

  public isTetrominosSequenceEmpty() {
    return this._tetrominosSequence.length <= 0;
  }

  public createTetrominosSequence(): void {
    try {
      if (this._tetrominosSequence.length > 0) {
        throw `tetromino sequence isn't empty but a new one is asked`;
      }
      let tetrominosNames = this.tetrominosConfig.map((blueprint) => {
        return blueprint.name;
      });
      this._tetrominosSequence = shuffle(tetrominosNames);
    } catch (error) {
      `Problem when trying to create a new tetromino sequence: ${error}`;
    }
  }

  public assignNewTetrominoOnBoard(
    direction: TetrominoDirection = TetrominoDirection.RIGHT
  ): void {
    try {
      if (this._tetrominosSequence.length <= 0) {
        throw `Tetrominos sequence is empty`;
      }
      this._currentTetrominoOnBoard = new Tetromino(
        this.getBlueprintWithName(this._tetrominosSequence[0]),
        this.tetrominoMovementTimer,
        direction
      );
      this._tetrominosSequence.shift();
    } catch (error) {
      log.error(`Cannot assign new tetromino on board: ${error}`);
    }
  }

  private getBlueprintWithName(name: string): TetrominoBlueprint {
    const blueprint = this.tetrominosConfig.find(
      (blueprintStored) => blueprintStored.name === name
    );
    if (!blueprint) {
      throw `no blueprint found with name ${name}`;
    }
    return blueprint;
  }

  /**
   * Loop call by the party
   */
  public updateLoop() {}
}

export type GamePosition = {
  x: number;
  y: number;
};
