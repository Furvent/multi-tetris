import {
  mockedBlueprintTetrominoTypeJ,
  mockedBoardDimension,
  mockedTetrominoTypeJPositionsCreationAtRight,
} from "./UtilsTest";
import { Tetromino } from "./Tetromino";
import {
  determinateTetrominoPositionOnBoard,
  placeNewTetromino,
  moveTetrominoWithVector
} from "./TetrisPartyPositionsUtils";

const mockedTetrominoTimer = 2000;
const mockedTetrominoAreaTopLeftPositionOnBoard = {
  x:
    Math.round(
      mockedBoardDimension.width / 2 - mockedBlueprintTetrominoTypeJ.side / 2
    ) + 1,
  y: 1,
};

test("Function determinateTetrominoPositionOnBoard()", () => {
  const mockedTetromino = new Tetromino(
    mockedBlueprintTetrominoTypeJ,
    mockedTetrominoTimer
  );
  determinateTetrominoPositionOnBoard(
    mockedTetromino,
    mockedTetrominoAreaTopLeftPositionOnBoard
  );
  expect(mockedTetromino.currentPosition).toEqual(
    mockedTetrominoTypeJPositionsCreationAtRight
  );
});

test("Function placeNewTetromino()", () => {
  const mockedTetromino = new Tetromino(
    mockedBlueprintTetrominoTypeJ,
    mockedTetrominoTimer
  );
  placeNewTetromino(mockedTetromino, mockedBoardDimension);
  expect(mockedTetromino.currentPosition).toEqual(
    mockedTetrominoTypeJPositionsCreationAtRight
  );
});

test("Function moveTetrominoWithVector()", () => {
  const mockedTetromino = new Tetromino(
    mockedBlueprintTetrominoTypeJ,
    mockedTetrominoTimer
  );
  placeNewTetromino(mockedTetromino, mockedBoardDimension);
  moveTetrominoWithVector(mockedTetromino, {x: 0, y: 1})
  expect(mockedTetromino.currentPosition).toEqual(
    [
      {x: 4, y: 2},
      {x: 4, y: 3},
      {x: 5, y: 3},
      {x: 6, y: 3},
    ]
  );
} )