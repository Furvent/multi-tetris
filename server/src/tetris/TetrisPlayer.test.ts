import { TetrisPlayer } from "./TetrisPlayer";
import { LobbyUsersManager } from "../lobby/LobbyUsersManager";
import SocketMock from "socket.io-mock";
import { LobbyUser } from "../lobby/LobbyUser";
import { TetrominoBlueprint } from "./Tetromino";

const id = "12345";
const pseudo = "Bob";
const mockedTetrominoBluprints: TetrominoBlueprint[] = [
  {
    name: "mockedBluprint",
    side: 4,
    shapes: {
      top: [1, 1, 1, 1],
      right: [1, 1, 1, 1],
      bottom: [1, 1, 1, 1],
      left: [1, 1, 1, 1],
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
      mockedTetrominoBluprints
    );
  }
  expect(mockedTetrisPlayer).toEqual({
    _gameId: 0,
    _pseudo: "Bob",
    _socket: mockedSocket,
    hasLoadedGame: false,
    isDisconnected: false,
    tetrominosConfig: mockedTetrominoBluprints
  });
});

test("Export private game data", () => {
  LobbyUsersManager.getInstance().resetLobbyUsers();
  const mockedTetrisPlayer = createNewTetrisPlayer(id, pseudo, 0);
  expect(mockedTetrisPlayer?.exportPrivateGameData()).toEqual({
    gameId: 0,
    pseudo: "Bob",
    isDisconnected: false,
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
      mockedTetrominoBluprints
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
