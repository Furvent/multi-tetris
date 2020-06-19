import { TetrisPlayer } from "./TetrisPlayer";
import { PlayersManager } from "../lobby/PlayersManager";
import SocketMock from "socket.io-mock";
import { Player } from "../lobby/Player";

const id = "12345";
const pseudo = "Bob";

test("Create new Tetris player", () => {
  PlayersManager.getInstance().resetPlayers();
  const mockedSocket = createNewMockedSocket(id);
  const mockedLobbyPlayer = createNewMockedPlayer(mockedSocket, pseudo);
  let mockedTetrisPlayer: TetrisPlayer | null = null;
  if (mockedLobbyPlayer) {
    mockedTetrisPlayer = new TetrisPlayer(mockedLobbyPlayer, 0); 
  }
  // const mockedTetrisPlayer = createNewTetrisPlayer(id, pseudo, 0);
  expect(mockedTetrisPlayer).toEqual({
    _gameId: 0,
    _pseudo: "Bob",
    _socket: mockedSocket,
    hasLoadedGame: false,
    isDisconnected: false
  })
})

test("Export private game data", () => {
  PlayersManager.getInstance().resetPlayers();
  const mockedTetrisPlayer = createNewTetrisPlayer(id, pseudo, 0);
  expect(mockedTetrisPlayer?.exportPrivateGameData()).toEqual({
    gameId: 0,
    pseudo: "Bob",
    isDisconnected: false
  })
})

function createNewTetrisPlayer(
  id: string,
  pseudo: string,
  gameId: number
): TetrisPlayer | null {
  const mockedSocket = createNewMockedSocket(id);
  const mockedLobbyPlayer = createNewMockedPlayer(mockedSocket, pseudo);
  let mockedTetrisPlayer: TetrisPlayer | null = null
  if (mockedLobbyPlayer) {
    mockedTetrisPlayer = new TetrisPlayer(mockedLobbyPlayer, gameId);
  }
  return mockedTetrisPlayer
}

function createNewMockedPlayer(mockedSocket: SocketIO.Socket, pseudo?: string): Player | null {
  return PlayersManager.getInstance().createPlayer(mockedSocket, pseudo)
}

function createNewMockedSocket(id: string): any {
  const mockedSocket = new SocketMock();
  mockedSocket.id = id;
  return mockedSocket;
}
