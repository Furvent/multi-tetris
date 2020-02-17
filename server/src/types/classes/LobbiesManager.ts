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


  // deleteLobbyWithId
  
  // Player Leave Lobby

  // Launch party

  playerJoinLobbyWithId(lobbyId: number, player: SocketIO.Socket): void {
    try {
      const lobby = this.getLobbyWithId(lobbyId);
      if (lobby === undefined) {
        throw "No lobby with that id";
      } else if (this.isPlayerAlreadyInAnotherLobby(player)) {
        throw `User ${player.id} is already in another lobby`;
      } else {
        lobby.addPlayer(player);
        emitUpdatePrivateLobbyData(lobby.exportInPrivateLobby(), lobby.getSocketRoom())
      }
    } catch (error) {
      console.error(
        `Problem when adding user ${player.id} to lobby with id ${lobbyId}: ${error}`
      );
    }
  }

  playerCreateLobby(player: SocketIO.Socket, roomName: string): void {
    try {
      if (this.isPlayerAlreadyInAnotherLobby(player)) {
        throw `Player ${player.id} is already in another lobby`;
      }
      const newLobby = new Lobby(this.idUsedIncrementator++, player.id, roomName);
      newLobby.addPlayer(player)
      this.lobbies.push(newLobby);
      this.playerAskPublicLobbies(player)
      emitUpdatePrivateLobbyData(newLobby.exportInPrivateLobby(), newLobby.getSocketRoom())
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

  playerChangeAvailabiltyStatusInPrivateLobby(player: SocketIO.Socket, lobbyId: number, availability: boolean = false) {
    try {
      const lobby = this.getLobbyWithId(lobbyId)
      if (lobby == undefined) {
        throw `No lobby with id ${lobbyId}`
      }

      const playerSearched = lobby.getPlayerWithId(player.id)
      if (playerSearched == undefined) {
        throw `Player ${player.id} is not in lobby with id ${lobbyId}`
      }
      playerSearched.isReadyInPrivateLobby = availability
      emitUpdatePrivateLobbyData(lobby.exportInPrivateLobby(), lobby.getSocketRoom())
    } catch (error) {
      console.error(
        `In method playerChangeAvailabiltyStatusInPrivateLobby(), call by player ${player.id} problem: ${error}`
      )
    }
  }

  private getLobbyWithId(id: number): Lobby | undefined {
    const lobbySearched = this.lobbies.find(lobby => lobby.getId() === id);
    return lobbySearched
  }

  private isPlayerAlreadyInAnotherLobby(playerSearched: SocketIO.Socket): boolean {
    const answer = this.lobbies.some(lobby => {
      return lobby.players.some(player => {
        return player.id === playerSearched.id
      })
    })
    return answer;
  }
}
