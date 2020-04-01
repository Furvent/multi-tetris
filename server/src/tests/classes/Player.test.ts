import { Player } from "../../types/classes/Player";
import SocketMock from 'socket.io-mock';
import log from '../../private-module/PrivateLogger'

const mockedSocket = new SocketMock();

const mockedPlayer = new Player(mockedSocket)
log.info(`In mocked player, id: ${mockedPlayer.id}`)

test('Get id from mocked player', () => {
    expect(mockedPlayer.id == mockedSocket.id).toBe(true);
})

