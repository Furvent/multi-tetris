import { IRoom } from "../interfaces/IRoom";
import { Player } from "./Player";

export class Lobby implements IRoom {
  players: Player[];
  private id: number;
  private socketRoomName: string;

  constructor(id: number, creator: SocketIO.Socket) {
    this.id = id;
    this.socketRoomName = `room${this.id}`
    this.addPlayer(creator);
  }

  isFull(): boolean {
    throw new Error("Method not implemented.");
  }

  getId(): number {
    return this.id;
  }

  getSocketRoom(): string {
    return this.socketRoomName;
  }

  addPlayer(socket: SocketIO.Socket) {
    try {
      if (this.getPlayerWithId(socket.id) !== null)
        throw `Player with id ${socket.id} is already in loby with id ${this.id}`;
      else {
        const newPlayer = new Player(socket);
        this.players.push(newPlayer);
        socket.join(this.socketRoomName)
      }
    } catch (error) {
        console.error(`Problem when trying to create a new player: ${error}`)
    }
  }

  getPlayerWithId(id: string): Player {
    this.players.forEach(player => {
      if ((player.id = id)) return player;
    });
    return null;
  }
}
