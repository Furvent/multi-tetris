import { Player } from "../classes/Player";
import { Socket } from "dgram";

export interface IRoom {
    players: Player[]

    isFull(): boolean
    getId(): number
    getSocketIORoom(): string
    addPlayer(socket: SocketIO.Socket)
}