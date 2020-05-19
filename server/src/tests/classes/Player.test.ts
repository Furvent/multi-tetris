// import { Player } from "../../types/classes/Player";
// import SocketMock from "socket.io-mock";

// const mockedPlayer = createNewMockedPlayer("1");

// test("Get id from mocked player", () => {
//   expect(mockedPlayer.id == "1").toBe(true);
// });

// test("Export in private lobby", () => {
//   expect(mockedPlayer.exportToLobbyPlayer()).toEqual({
//     pseudo: "pseudoTemp1",
//     isReady: false
//   });
// });

// export function createNewMockedPlayer(id: string): Player {
//   const mockedPlayer = new Player(createNewMockedSocket(id), "bob");
//   return mockedPlayer;
// }

// export function createNewMockedSocket(id: string): any {
//   const mockedSocket = new SocketMock();
//   mockedSocket.id = id;
//   return mockedSocket;
// }
