import { Player } from "./Player";
import SocketMock from "socket.io-mock";
import { PlayersManager } from "./PlayersManager";

const id = "12345"
const pseudo = "bob"

test("Create a new player", () => {
  const mockedSocket = createNewMockedSocket(id)
  const mockedPlayer = createNewMockedPlayer(mockedSocket, pseudo);
  expect(mockedPlayer).toEqual({
    id: id,
    pseudo:pseudo,
    socket: mockedSocket,
    isReadyInPrivateLobby: false
  });
});

test("Export in private lobby", () => {
  expect(PlayersManager.getInstance().getPlayerWithSocketId(id)?.exportToLobbyPlayer()).toEqual({
    pseudo: pseudo,
    isReady: false
  });
});

export function createNewMockedPlayer(mockedSocket: SocketIO.Socket, pseudo?: string): Player | null {
  return PlayersManager.getInstance().createPlayer(mockedSocket, pseudo)
}

export function createNewMockedSocket(id: string): any {
  const mockedSocket = new SocketMock();
  mockedSocket.id = id;
  return mockedSocket;
}
