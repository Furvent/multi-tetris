export function disconnectEvent(socket: SocketIO.Socket) {
    socket.on('disconnect', () => {
        console.log(`DISCONNECT: client with id ${socket.id}`)
    })
}