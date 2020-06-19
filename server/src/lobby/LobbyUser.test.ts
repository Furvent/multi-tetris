import { LobbyUser } from "./LobbyUser";
import SocketMock from "socket.io-mock";
import { LobbyUsersManager } from "./LobbyUsersManager";

const id = "12345"
const pseudo = "bob"

test("Create a new lobbyUser", () => {
  const mockedSocket = createNewMockedSocket(id)
  const mockedLobbyUser = createNewMockedLobbyUser(mockedSocket, pseudo);
  expect(mockedLobbyUser).toEqual({
    id: id,
    pseudo:pseudo,
    socket: mockedSocket,
    isReadyInPrivateLobby: false
  });
});

test("Export in private lobby", () => {
  expect(LobbyUsersManager.getInstance().getLobbyUserWithSocketId(id)?.exportDataToLobby()).toEqual({
    pseudo: pseudo,
    isReady: false
  });
});

export function createNewMockedLobbyUser(mockedSocket: SocketIO.Socket, pseudo?: string): LobbyUser | null {
  return LobbyUsersManager.getInstance().createLobbyUser(mockedSocket, pseudo)
}

export function createNewMockedSocket(id: string): any {
  const mockedSocket = new SocketMock();
  mockedSocket.id = id;
  return mockedSocket;
}
