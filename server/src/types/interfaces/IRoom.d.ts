import { Player } from "../classes/Player";
import { Socket } from "dgram";

export interface IRoom {
    players: Player[]

    isFull(): boolean
    getId(): number
    getSocketRoom(): string
    addPlayer(socket: SocketIO.Socket)
}