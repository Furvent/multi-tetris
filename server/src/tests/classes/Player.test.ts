import { Player } from "../../types/classes/Player";
import SocketMock from 'socket.io-mock';
import log from '../../private-module/PrivateLogger'
// jest.mock("../../types/classes/Player");
// const mockedPlayer = <jest.Mock<Player>> Player;

const mockedSocket = new SocketMock();

const mockedPlayer = new Player(mockedSocket)
log.info(`In mocked player, id: ${mockedPlayer.id}`)

test('Get id from mocked player', () => {
    expect(mockedPlayer.id == mockedSocket.id).toBe(true);
})

