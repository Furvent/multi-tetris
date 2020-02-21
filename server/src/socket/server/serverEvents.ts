import log from '../../private-module/PrivateLogger'

export function disconnectEvent(socket: SocketIO.Socket) {
    socket.on('disconnect', () => {
        log.info(`DISCONNECT: client with id ${socket.id}`)
    })
}