import { TetrisPlayer } from "./TetrisPlayer";
import { LobbyUsersManager } from "../lobby/LobbyUsersManager";
import SocketMock from "socket.io-mock";
import { LobbyUser } from "../lobby/LobbyUser";
import { TetrominoBlueprint } from "./Tetromino";

const id = "12345";
const pseudo = "Bob";
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

test("Create new Tetris player", () => {
  LobbyUsersManager.getInstance().resetLobbyUsers();
  const mockedSocket = createNewMockedSocket(id);
  const mockedLobbyPlayer = createNewMockedPlayer(mockedSocket, pseudo);
  let mockedTetrisPlayer: TetrisPlayer | null = null;
  if (mockedLobbyPlayer) {
    mockedTetrisPlayer = new TetrisPlayer(
      mockedLobbyPlayer,
      0,
      mockedTetrominoBlueprint,
      mockedTetrominoTimer
    );
  }
  expect(mockedTetrisPlayer).toEqual(
    expect.objectContaining({
      _gameId: 0,
      _pseudo: "Bob",
      _socket: mockedSocket,
      hasLoadedGame: false,
      isDisconnected: false,
    })
  );
});

test("Export private game data", () => {
  LobbyUsersManager.getInstance().resetLobbyUsers();
  const mockedTetrisPlayer = createNewTetrisPlayer(id, pseudo, 0);
  expect(mockedTetrisPlayer?.exportPrivateGameData()).toEqual({
    gameId: 0,
    pseudo: "Bob",
    debugMessage: "This part is in construction",
    staticCells: [],
  });
});

function createNewTetrisPlayer(
  id: string,
  pseudo: string,
  gameId: number
): TetrisPlayer | null {
  const mockedSocket = createNewMockedSocket(id);
  const mockedLobbyPlayer = createNewMockedPlayer(mockedSocket, pseudo);
  let mockedTetrisPlayer: TetrisPlayer | null = null;
  if (mockedLobbyPlayer) {
    mockedTetrisPlayer = new TetrisPlayer(
      mockedLobbyPlayer,
      gameId,
      mockedTetrominoBlueprint,
      mockedTetrominoTimer
    );
  }
  return mockedTetrisPlayer;
}

function createNewMockedPlayer(
  mockedSocket: SocketIO.Socket,
  pseudo?: string
): LobbyUser | null {
  return LobbyUsersManager.getInstance().createLobbyUser(mockedSocket, pseudo);
}

function createNewMockedSocket(id: string): any {
  const mockedSocket = new SocketMock();
  mockedSocket.id = id;
  return mockedSocket;
}
