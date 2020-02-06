 
import { Response, Request } from "express"
import Http from 'http'
import SocketIo from 'socket.io'

import Express from 'express'

export default class Server {

    static readonly PORT:number = 7070

    constructor() {
    }

    public start() {
        const app = Express()
        const serverHttp = Http.createServer(app)
        const io = SocketIo(serverHttp)
        app.get('/status', (req: Request, res: Response) => {
            res.send('Server running')
        })
        serverHttp.listen(Server.PORT, () => {
            console.log(`Server launch on port:${Server.PORT}`)
        })
        io.on('connect', (socket) => {
            console.log(`Connected client with id ${socket.id}`)
        })
    }
}