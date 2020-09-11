import { Tetromino, TetrominoDirection } from "./Tetromino";
import { mockedBlueprintTetrominoTypeJ } from "./UtilsTest";

const mockedTetrominoTimer = 2000;

test("Create new tetromino", () => {
  const mockedTetromino = new Tetromino(
    mockedBlueprintTetrominoTypeJ,
    mockedTetrominoTimer
  );
  expect(mockedTetromino).toEqual({
    _currentPosition: [],
    blueprint: mockedBlueprintTetrominoTypeJ,
    currentDirection: TetrominoDirection.RIGHT,
    timer: {
      _isOver: false,
      duration: mockedTetrominoTimer,
      setTimeoutController: null,
    },
  });

  expect(mockedTetromino.getSide()).toBe(mockedBlueprintTetrominoTypeJ.side)

  expect(mockedTetromino.getName()).toBe(mockedBlueprintTetrominoTypeJ.name)

  expect(mockedTetromino.getCurrentShape()).toEqual(
    mockedBlueprintTetrominoTypeJ.shapes[TetrominoDirection.RIGHT]
  )

  mockedTetromino.turn();
  expect(mockedTetromino.getCurrentShape()).toEqual(
    mockedBlueprintTetrominoTypeJ.shapes[TetrominoDirection.BOTTOM]
  )
});
