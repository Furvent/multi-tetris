import { Player } from "../classes/Player";

export interface IRoom {
    players: Player[]
    id: number

    isFull(): boolean
}