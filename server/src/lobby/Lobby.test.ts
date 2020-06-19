import { Lobby } from "./Lobby";
import SocketMock from "socket.io-mock";
import { LobbyUsersManager } from "./LobbyUsersManager";
import { LobbyUser } from "./LobbyUser";

const id_1 = "12345";
const pseudo_1 = "Bob";
const roomId_1 = "0";
const roomName_1 = "Bob's room";
let mockedSocket: SocketIO.Socket;
let mockedLobby: Lobby;

test("Create new lobby and add a new lobbyUser", () => {
  LobbyUsersManager.getInstance().resetLobbyUsers();
  mockedSocket = createNewMockedSocket(id_1);
  createNewMockedLobbyUser(mockedSocket, pseudo_1);
  mockedLobby = new Lobby(roomId_1, roomName_1);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: roomId_1,
    isFull: false,
    name: "Bob's room",
    numberOfLobbyUsers: 0,
  });
  mockedLobby.addLobbyUser(mockedSocket);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: roomId_1,
    isFull: false,
    name: "Bob's room",
    numberOfLobbyUsers: 1,
  });
});

test("Add lobbyUser already in lobby", () => {
  mockedLobby.addLobbyUser(mockedSocket);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: roomId_1,
    isFull: false,
    name: "Bob's room",
    numberOfLobbyUsers: 1,
  });
});

test("Remove lobbyUser not in lobby", () => {
  const mockedSocketNotInLobby = createNewMockedSocket("1246");
  mockedLobby.removeLobbyUser(mockedSocketNotInLobby);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: roomId_1,
    isFull: false,
    name: "Bob's room",
    numberOfLobbyUsers: 1,
  });
});

test("Remove lobbyUser to lobby", () => {
  mockedLobby.removeLobbyUser(mockedSocket);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: roomId_1,
    isFull: false,
    name: "Bob's room",
    numberOfLobbyUsers: 0,
  });
});

test("Get lobbyUser with id", () => {
  mockedLobby.addLobbyUser(mockedSocket);
  expect(mockedLobby.getLobbyUserWithId(id_1)?.id).toBe(id_1);
});

test("Cannot get lobbyUser with id", () => {
  expect(mockedLobby.getLobbyUserWithId("42")).toBe(undefined);
});

test("Export in private lobby", () => {
  expect(mockedLobby.exportInPrivateLobby()).toStrictEqual({
    id: roomId_1,
    isFull: false,
    name: roomName_1,
    numberOfLobbyUsers: 1,
    lobbyUsers: [
      {
        pseudo: pseudo_1,
        isReady: false,
      },
    ],
  });
});

test("Lobby is full", () => {
  mockedLobby.lobbyUsers = [];
  LobbyUsersManager.getInstance().resetLobbyUsers();
  for (let index = 0; index < mockedLobby.MAX_USER; index++) {
    mockedSocket = createNewMockedSocket(index.toString());
    const mockedLobbyUser = LobbyUsersManager.getInstance().createLobbyUser(
      mockedSocket
    );
    if (mockedLobbyUser) mockedLobbyUser.isReadyInPrivateLobby = true;
    mockedLobby.addLobbyUser(mockedSocket);
  }
  expect(mockedLobby.isFull()).toBe(true);
});

test("Lobby is full and ready", () => {
  mockedLobby.lobbyUsers = [];
  LobbyUsersManager.getInstance().resetLobbyUsers();
  for (let index = 0; index < mockedLobby.MAX_USER; index++) {
    mockedSocket = createNewMockedSocket(index.toString());
    const mockedLobbyUser = LobbyUsersManager.getInstance().createLobbyUser(
      mockedSocket
    );
    if (mockedLobbyUser) mockedLobbyUser.isReadyInPrivateLobby = true;
    mockedLobby.addLobbyUser(mockedSocket);
  }
  expect(mockedLobby.isGameReadyToLaunch()).toBe(true);
});

test("Lobby is full but all not ready", () => {
  mockedLobby.lobbyUsers = [];
  LobbyUsersManager.getInstance().resetLobbyUsers();
  for (let index = 0; index < mockedLobby.MAX_USER; index++) {
    mockedSocket = createNewMockedSocket(index.toString());
    const mockedLobbyUser = LobbyUsersManager.getInstance().createLobbyUser(
      mockedSocket
    );
    if (mockedLobbyUser) {
      if ((index === 1)) mockedLobbyUser.isReadyInPrivateLobby = false;
      else mockedLobbyUser.isReadyInPrivateLobby = true;
    }
    mockedLobby.addLobbyUser(mockedSocket);
  }
  expect(mockedLobby.isGameReadyToLaunch()).toBe(false);
});

test("Lobby is not full but all ready", () => {
  mockedLobby.lobbyUsers = [];
  LobbyUsersManager.getInstance().resetLobbyUsers();
  for (let index = 0; index < mockedLobby.MAX_USER - 1; index++) {
    mockedSocket = createNewMockedSocket(index.toString());
    const mockedLobbyUser = LobbyUsersManager.getInstance().createLobbyUser(
      mockedSocket
    );
    if (mockedLobbyUser) {
      mockedLobbyUser.isReadyInPrivateLobby = true;
    }
    mockedLobby.addLobbyUser(mockedSocket);
  }
  expect(mockedLobby.isGameReadyToLaunch()).toBe(false);
});

function createNewMockedLobbyUser(mockedSocket: SocketIO.Socket, pseudo?: string): LobbyUser | null {
  return LobbyUsersManager.getInstance().createLobbyUser(mockedSocket, pseudo)
}

function createNewMockedSocket(id: string): any {
  const mockedSocket = new SocketMock();
  mockedSocket.id = id;
  return mockedSocket;
}
