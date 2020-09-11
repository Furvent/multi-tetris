import { TetrominoBlueprint, TetrominoDirection } from "./Tetromino";
import { TetrisGameBoard } from "./TetrisGameBoard";

const mockedTetrominoTimer = 2000;
const mockedTetrominoBlueprint: TetrominoBlueprint[] = [
  {
    name: "mockedBlueprint",
    side: 4,
    shapes: {
      top: [
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ],
      bottom: [
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ],
      left: [
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ],
      right: [
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ],
    },
  },
];

test("Create new TetrisGameBoard", () => {
  const mockedTetrisGameBoard = new TetrisGameBoard(
    mockedTetrominoBlueprint,
    mockedTetrominoTimer
  );
  expect(mockedTetrisGameBoard).toEqual({
    _currentTetrominoOnBoard: null,
    _occupiedCells: [],
    _tetrominosSequence: [mockedTetrominoBlueprint[0].name],
    tetrominoMovementTimer: mockedTetrominoTimer,
    tetrominosConfig: mockedTetrominoBlueprint,
  });
  expect(mockedTetrisGameBoard.isTetrominosSequenceEmpty()).toBe(false);
  mockedTetrisGameBoard.assignNewTetrominoOnBoard();
  expect(mockedTetrisGameBoard.currentTetrominoOnBoard).toEqual({
    _currentPosition: [],
    blueprint: mockedTetrominoBlueprint[0],
    currentDirection: TetrominoDirection.RIGHT,
    timer: {
      _isOver: false,
      duration: mockedTetrominoTimer,
      setTimeoutController: null,
    },
  });
});
