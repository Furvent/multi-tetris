import { Lobby } from "./Lobby";
import { emitUpdatePrivateLobbyData, emitCreateNewLobby, emitPublicLobbies } from "../../socket/lobby";

/**
 * Is singleton
 *
 * TODO: Rename user var's and func's names to player
 */
export class LobbiesManager {
  private static instance: LobbiesManager;
  private constructor() {
    this.lobbies = [];
    this.idUsedIncrementator = 0;
  }
  static getInstance(): LobbiesManager {
    if (!LobbiesManager.instance)
      LobbiesManager.instance = new LobbiesManager();
    return LobbiesManager.instance;
  }

  private lobbies: Lobby[];
  private idUsedIncrementator: number;

  // WIP
  // deleteLobbyWithId(id: number) {
  //   try {
  //     const index = this.lobbies.findIndex(lobby => lobby.getId() === id);
  //     if (index === -1) {
  //       throw "No Lobby with that id";
  //     }
  //     this.lobbies.splice(index, 1);
  //     // TODO: EMIT CODE
  //   } catch (error) {
  //     console.error(
  //       `Problem when trying to delete lobby with id ${id}: ${error}`
  //     );
  //   }
  // }
  
  // Player Leave Lobby

  // Launch party

  playerJoinLobbyWithId(id: number, player: SocketIO.Socket): void {
    try {
      const lobby = this.getLobbyWithId(id);
      if (lobby === null) {
        throw "No lobby with that id";
      } else if (this.isPlayerAlreadyInAnotherLobby(player)) {
        throw `User ${player.id} is already in another lobby`;
      } else {
        lobby.addPlayer(player);
        emitUpdatePrivateLobbyData(player, lobby.exportInPrivateLobby(), lobby.getSocketRoom())
      }
    } catch (error) {
      console.error(
        `Problem when adding user ${player.id} to lobby with id ${id}: ${error}`
      );
    }
  }

  playerCreateLobby(player: SocketIO.Socket, roomName: string): void {
    try {
      if (this.isPlayerAlreadyInAnotherLobby(player)) {
        throw `Player ${player.id} is already in another lobby`;
      }
      const newLobby = new Lobby(this.idUsedIncrementator++, player, roomName);
      this.lobbies.push(newLobby);
      emitCreateNewLobby(player, newLobby.exportInPublicLobby())
      emitUpdatePrivateLobbyData(player, newLobby.exportInPrivateLobby(), newLobby.getSocketRoom())
    } catch (error) {
      console.error(
        `Problem when player ${player.id} tried to create new lobby: ${error}`
      );
    }
  }

  playerAskPublicLobbies(player:SocketIO.Socket): void {
    const publicLobbies = this.lobbies.map((lobby) => lobby.exportInPublicLobby())
    emitPublicLobbies(player, publicLobbies)
  }

  private getLobbyWithId(id: number): Lobby | null {
    const lobbySearched = this.lobbies.find(lobby => lobby.getId() === id);
    return lobbySearched !== undefined ? lobbySearched : null;
  }

  private isPlayerAlreadyInAnotherLobby(user): boolean {
    this.lobbies.forEach(lobby => {
      lobby.players.forEach(player => {
        if (player.id === user.id) return true;
      });
    });
    return false;
  }
}
