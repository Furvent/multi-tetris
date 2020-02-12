import { Lobby } from "./Lobby";
import { PayloadPrivateLobby } from "../../../../share/interfaces/PayloadPrivateLobby";

/**
 * Is singleton
 * 
 * TODO: Rename user var's and func's names to player
 */
export class LobbiesManager {
  private static instance: LobbiesManager;
  private constructor() {
    this.idUsedIncrementator = 0;
    const bob: PayloadPrivateLobby = {
      id: 8,
      players: [{ id: "7874" }],
      isFull: true
    };
    console.log(bob);
  }
  static getInstance(): LobbiesManager {
    if (!LobbiesManager.instance)
      LobbiesManager.instance = new LobbiesManager();
    return LobbiesManager.instance;
  }

  private lobbies: Lobby[];
  idUsedIncrementator: number;

  deleteLobbyWithId(id: number) {
    try {
      const index = this.lobbies.findIndex(lobby => lobby.getId() === id);
      if (index === -1) throw "No Lobby with that id";
      this.lobbies.splice(index, 1);
    } catch (error) {
      console.error(
        `Problem when trying to delete lobby with id ${id}: ${error}`
      );
    }
  }

  userJoinLobbyWithId(id: number, user: SocketIO.Socket): void {
    try {
      const lobby = this.getLobbyWithId(id);
      if (lobby === null) {
        throw "No lobby with that id";
      } else if (this.isUSerAlreadyInAnotherLobby(user)) {
        throw `User ${user.id} is already in another lobby`;
      } else {
        lobby.addPlayer(user);
        // TODO emit event
      }
    } catch (error) {
      console.error(
        `Problem when adding user ${user.id} to lobby with id ${id}: ${error}`
      );
    }
  }

  userCreateLobby(creator: SocketIO.Socket): void {
    try {
      if (this.isUSerAlreadyInAnotherLobby(creator)) {
        throw `Creator ${creator.id} is already in another lobby`;
      }
      const newLobby = new Lobby(this.idUsedIncrementator++, creator);
      this.lobbies.push(newLobby);
      // TODO emit event
    } catch (error) {
      console.error(
        `Problem when user ${creator.id} tried to create new lobby: ${error}`
      );
    }
  }

  private getLobbyWithId(id: number): Lobby | null {
    const lobbySearched = this.lobbies.find(lobby => lobby.getId() === id);
    return lobbySearched !== undefined ? lobbySearched : null;
  }

  private isUSerAlreadyInAnotherLobby(user): boolean {
    this.lobbies.forEach(lobby => {
      lobby.players.forEach(player => {
        if (player.id === user.id) return true;
      });
    });
    return false;
  }
}
