import { Lobby } from "./Lobby";
import {
  emitUpdatePrivateLobbyData,
  emitPublicLobbies
} from "../../socket/lobby";

/**
 * Is singleton
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

  // Launch party

  playerJoinLobbyWithId(lobbyId: number, player: SocketIO.Socket): void {
    try {
      this.checkIfPlayerIsInAnotherLobbyAndThrowError(player);
      const lobbyToJoin = this.getLobbyWithId(lobbyId);
      if (lobbyToJoin === undefined) {
        throw this.errorNoLobbyWithThatId(lobbyId);
      }

      lobbyToJoin.addPlayer(player);
      emitUpdatePrivateLobbyData(
        lobbyToJoin.exportInPrivateLobby(),
        lobbyToJoin.getSocketRoom()
      );
    } catch (error) {
      console.error(
        `Problem when adding user ${player.id} to lobby with id ${lobbyId}: ${error}`
      );
    }
  }

  playerCreateLobby(player: SocketIO.Socket, roomName: string): void {
    try {
      this.checkIfPlayerIsInAnotherLobbyAndThrowError(player);
      const newLobby = new Lobby(
        this.idUsedIncrementator++,
        player.id,
        roomName
      );
      newLobby.addPlayer(player);
      this.lobbies.push(newLobby);
      this.playerAskPublicLobbies(player);
      emitUpdatePrivateLobbyData(
        newLobby.exportInPrivateLobby(),
        newLobby.getSocketRoom()
      );
    } catch (error) {
      console.error(
        `Problem when player ${player.id} tried to create new lobby: ${error}`
      );
    }
  }

  playerAskPublicLobbies(player: SocketIO.Socket): void {
    const publicLobbies = this.lobbies.map(lobby =>
      lobby.exportInPublicLobby()
    );
    emitPublicLobbies(player, publicLobbies);
  }

  playerChangeAvailabiltyStatusInPrivateLobby(
    player: SocketIO.Socket,
    lobbyId: number,
    availability: boolean = false
  ) {
    try {
      const lobby = this.getLobbyWithId(lobbyId);
      if (lobby === undefined) {
        throw this.errorNoLobbyWithThatId(lobbyId);
      }

      const playerSearched = lobby.getPlayerWithId(player.id);
      if (playerSearched == undefined) {
        throw this.errorPlayerIsNotInThisLobby(player.id, lobbyId);
      }
      playerSearched.isReadyInPrivateLobby = availability;
      emitUpdatePrivateLobbyData(
        lobby.exportInPrivateLobby(),
        lobby.getSocketRoom()
      );
    } catch (error) {
      console.error(
        `In method playerChangeAvailabiltyStatusInPrivateLobby(), call by player ${player.id} problem: ${error}`
      );
    }
  }

  playerLeavePrivateLobby(player: SocketIO.Socket): void {
    try {
      const playerLobby = this.findPlayerLobby(player);
      if (playerLobby === undefined) {
        throw this.errorPlayerHasNoLobby(player.id);
      }
      playerLobby.removePlayer(player);
      emitUpdatePrivateLobbyData(
        playerLobby.exportInPrivateLobby(),
        playerLobby.getSocketRoom()
      );
    } catch (error) {
      console.error(`Problem when player ${player.id} tried to leave lobby: ${error}`)
    }
  }

  private getLobbyWithId(id: number): Lobby | undefined {
    const lobbySearched = this.lobbies.find(lobby => lobby.getId() === id);
    return lobbySearched;
  }

  private findPlayerLobby(playerSearched: SocketIO.Socket): Lobby | undefined {
    return this.lobbies.find(lobby => {
      return lobby.players.some(player => player.id === playerSearched.id);
    });
  }

  private checkIfPlayerIsInAnotherLobbyAndThrowError(player: SocketIO.Socket) {
    const lobbyAlreadyOccupied = this.findPlayerLobby(player);
    if (lobbyAlreadyOccupied !== undefined) {
      throw this.errorPlayerIsAlreadyInAnotherLobby(
        player.id,
        lobbyAlreadyOccupied.getId()
      );
    }
  }

  private errorPlayerIsAlreadyInAnotherLobby(
    playerId: string,
    lobbyId: number
  ): string {
    return `Player ${playerId} is already in lobby: ${lobbyId}`;
  }

  private errorNoLobbyWithThatId(id: number): string {
    return `No lobby with id: ${id}`;
  }

  private errorPlayerIsNotInThisLobby(
    playerId: string,
    lobbyId: number
  ): string {
    return `Player ${playerId} is not in lobby: ${lobbyId}`;
  }

  private errorPlayerHasNoLobby(playerId: string): string {
    return `Player ${playerId} has no lobby`;
  }
}
