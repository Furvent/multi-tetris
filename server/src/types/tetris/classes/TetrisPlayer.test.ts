import {
  createNewMockedSocket,
  createNewMockedPlayer,
} from "../../classes/Player.test";
import { TetrisPlayer } from "./TetrisPlayer";
import { PlayersManager } from "../../classes/PlayersManager";

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

export function createNewTetrisPlayer(
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
