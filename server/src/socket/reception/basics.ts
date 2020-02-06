export function loadBasicEvents(socket: SocketIO.Socket) {
    socket.on('disconnect', (socket) => {
        console.log(`DISCONNECT: client with id ${socket.id}`) // For now id is undefined
    })
}