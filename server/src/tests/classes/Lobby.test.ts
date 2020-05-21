import { Lobby } from "../../types/classes/Lobby";
import { createNewMockedSocket, createNewMockedPlayer } from "./Player.test";
import { PlayersManager } from "../../types/classes/PlayersManager";
import { LobbiesManager } from "../../types/classes/LobbiesManager";

const id_1 = "12345";
const pseudo_1 = "Bob";
const roomId_1 = 0;
const roomName_1 = "Bob's room";
let mockedSocket: SocketIO.Socket;
let mockedLobby: Lobby;

test("Create new lobby and add a new player", () => {
  PlayersManager.getInstance().resetPlayers();
  mockedSocket = createNewMockedSocket(id_1);
  createNewMockedPlayer(mockedSocket, pseudo_1);
  mockedLobby = new Lobby(roomId_1, roomName_1);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: 0,
    isFull: false,
    name: "Bob's room",
    numberOfPlayers: 0,
  });
  mockedLobby.addPlayer(mockedSocket);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: 0,
    isFull: false,
    name: "Bob's room",
    numberOfPlayers: 1,
  });
});

test("Add player already in lobby", () => {
  mockedLobby.addPlayer(mockedSocket);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: 0,
    isFull: false,
    name: "Bob's room",
    numberOfPlayers: 1,
  });
});

test("Remove player not in lobby", () => {
  const mockedSocketNotInLobby = createNewMockedSocket("1246");
  mockedLobby.removePlayer(mockedSocketNotInLobby);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: 0,
    isFull: false,
    name: "Bob's room",
    numberOfPlayers: 1,
  });
});

test("Remove player to lobby", () => {
  mockedLobby.removePlayer(mockedSocket);
  expect(mockedLobby.exportInPublicLobby()).toEqual({
    id: 0,
    isFull: false,
    name: "Bob's room",
    numberOfPlayers: 0,
  });
});

test("Get player with id", () => {
  mockedLobby.addPlayer(mockedSocket);
  expect(mockedLobby.getPlayerWithId(id_1)?.id).toBe(id_1);
});

test("Cannot get player with id", () => {
  expect(mockedLobby.getPlayerWithId("42")).toBe(undefined);
});

test("Export in private lobby", () => {
  expect(mockedLobby.exportInPrivateLobby()).toStrictEqual({
    id: roomId_1,
    isFull: false,
    name: roomName_1,
    numberOfPlayers: 1,
    players: [
      {
        pseudo: pseudo_1,
        isReady: false
      }
    ]
  });
});
