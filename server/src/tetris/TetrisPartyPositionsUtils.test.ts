import { mockedBlueprintTetrominoTypeJ, mockedBoardDimension, mockedTetrominoTypeJPositionsCreationAtRight } from './UtilsTest';
import { Tetromino } from './Tetromino';
import { determinateTetrominoPositionOnBoard } from './TetrisPartyPositionsUtils';

const mockedTetrominoTimer = 2000;
const mockedTetrominoAreaTopLeftPositionOnBoard = {
  x: Math.round(mockedBoardDimension.width / 2 - mockedBlueprintTetrominoTypeJ.side / 2) + 1,
  y: 1,
}

test('Function determinateTetrominoPositionOnBoard()', () => {
  const mockedTetromino = new Tetromino(mockedBlueprintTetrominoTypeJ, mockedTetrominoTimer)
  determinateTetrominoPositionOnBoard(mockedTetromino, mockedTetrominoAreaTopLeftPositionOnBoard);
  console.log("mockedTetrominoAreaTopLeftPositionOnBoard", mockedTetrominoAreaTopLeftPositionOnBoard)
  expect(mockedTetromino.currentPosition).toEqual(
    mockedTetrominoTypeJPositionsCreationAtRight
  )
})