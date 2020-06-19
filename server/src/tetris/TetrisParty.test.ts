import { PlayersManager } from "../lobby/PlayersManager";
import { LobbiesManager } from "../lobby/LobbiesManager";
import { TetrisParty } from "./TetrisParty";
import SocketMock from "socket.io-mock";

const mockedSocketId_1 = "12369";
const mockedPlayerName_1 = "Furvent";
const mockedRoomName_1 = "Furvent's room";

const mockedSocketId_2 = "98741";
const mockedPlayerName_2 = "Litshei";

const mockedSocketId_3 = "456321";
const mockedPlayerName_3 = "Sadeh";

const mockedTetrisPartyId = "0";

test("expect to get a player", () => {
  PlayersManager.getInstance().resetPlayers();
  LobbiesManager.getInstance().resetLobbies();

  const mockedSocket_1 = createNewMockedSocket(mockedSocketId_1);
  const mockedPlayer_1 = PlayersManager.getInstance().createPlayer(
    mockedSocket_1,
    mockedPlayerName_1
  );
  LobbiesManager.getInstance().playerCreateLobby(
    mockedSocket_1,
    mockedRoomName_1
  );
  const mockedSocket_2 = createNewMockedSocket(mockedSocketId_2);
  const mockedPlayer_2 = PlayersManager.getInstance().createPlayer(
    mockedSocket_2,
    mockedPlayerName_2
  );
  LobbiesManager.getInstance().playerJoinLobbyWithId("0", mockedSocket_2);
  const mockedSocket_3 = createNewMockedSocket(mockedSocketId_3);
  const mockedPlayer_3 = PlayersManager.getInstance().createPlayer(
    mockedSocket_3,
    mockedPlayerName_3
  );
  LobbiesManager.getInstance().playerJoinLobbyWithId("0", mockedSocket_3);
  const mockedLobby = LobbiesManager.getInstance().getLobbies()[0];
  const mockedParty = new TetrisParty(mockedLobby, mockedTetrisPartyId);
  const mockedTetrisPlayer_1 = mockedParty.getPlayerWithId(mockedSocketId_1)
  const mockedTetrisPlayer_2 = mockedParty.getPlayerWithId(mockedSocketId_2)
  const mockedTetrisPlayer_3 = mockedParty.getPlayerWithId(mockedSocketId_3)
  expect(mockedParty).toEqual({
    gameState: "LOADING",
    id: "0",
    players: [
      mockedTetrisPlayer_1,
      mockedTetrisPlayer_2,
      mockedTetrisPlayer_3
    ],
    socketIORoomName:"party0"
  });
});

function createNewMockedSocket(id: string): any {
  const mockedSocket = new SocketMock();
  mockedSocket.id = id;
  return mockedSocket;
}
