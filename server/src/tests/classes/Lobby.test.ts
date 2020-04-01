import { Player } from "../../types/classes/Player";
import SocketMock from "socket.io-mock";
import log from "../../private-module/PrivateLogger";
import { Lobby } from "../../types/classes/Lobby";

const player1 = createNewMockedPlayer("1");
const mockedLobby = new Lobby(1, player1.id, "room 1");

test("Add player to lobby", () => {
  mockedLobby.addPlayer(player1.socket);
  expect(mockedLobby.players.length).toBe(1);
});

test("Add player already in lobby", () => {
  mockedLobby.addPlayer(player1.socket);
  expect(mockedLobby.players.length).toBe(1);
});

test("Remove player not in lobby", () => {
  const mockedSocketNotInLobby = createNewMockedSocket("1246");
  mockedLobby.removePlayer(mockedSocketNotInLobby);
  expect(mockedLobby.players.length).toBe(1);
});

test("Remove player to lobby", () => {
  mockedLobby.removePlayer(player1.socket);
  expect(mockedLobby.players.length).toBe(0);
});

test("Get player with id", () => {
  mockedLobby.addPlayer(createNewMockedPlayer("45").socket);
  expect(mockedLobby.getPlayerWithId("45")?.id).toBe("45");
});

test("Cannot get player with id", () => {
  mockedLobby.addPlayer(createNewMockedPlayer("72").socket);
  expect(mockedLobby.getPlayerWithId("42")).toBe(undefined);
});

test("Export in public lobby", () => {
  expect(mockedLobby.exportInPublicLobby()).toStrictEqual({
    id: 1,
    isFull: false,
    name: "room 1",
    numberOfPlayers: 2
  });
});

test("Export in private lobby", () => {
  expect(mockedLobby.exportInPrivateLobby()).toStrictEqual({
    id: 1,
    isFull: false,
    name: "room 1",
    numberOfPlayers: 2,
    players: [
      {
        pseudo: "pseudoTemp45",
        isReady: false
      },
      {
        pseudo: "pseudoTemp72",
        isReady: false
      }
    ]
  });
});

// -------------------------------------

function createNewMockedPlayer(id: string): Player {
  const mockedPlayer = new Player(createNewMockedSocket(id));
  return mockedPlayer;
}

function createNewMockedSocket(id: string): any {
  const mockedSocket = new SocketMock();
  mockedSocket.id = id;
  return mockedSocket;
}
