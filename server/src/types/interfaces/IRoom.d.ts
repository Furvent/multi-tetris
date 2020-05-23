import { Player } from "../classes/Player";

export interface IRoom {
    players: Player[]

    isFull(): boolean
    getId(): number
    getSocketIORoom(): string
    addPlayer(socket: SocketIO.Socket)
}