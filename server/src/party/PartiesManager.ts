import { IParty } from "../interfaces/IParty";
import { Lobby } from "../lobby/Lobby";
import log from "../private-module/PrivateLogger";
import { TetrisParty } from "../tetris/TetrisParty";
import { IngamePlayer } from "./IngamePlayer";
import { TetrisPlayer } from "../tetris/TetrisPlayer";
import { LobbyUser } from "../lobby/LobbyUser";
import { GenericGameState } from "./enum/GameState";
import { PlayerInput } from "../tetris/enums";

/**
 * TODO: utiliser un module de création d'id pour les parties.
 */
export class PartiesManager {
  const;

  private static instance: PartiesManager;
  private parties: IParty[];
  private idUsedIncrementator: number;

  private constructor() {
    this.parties = [];
    this.idUsedIncrementator = 0;
    this.initLoopUpdate();
  }

  public static getInstance(): PartiesManager {
    if (!PartiesManager.instance) {
      PartiesManager.instance = new PartiesManager();
    }
    return PartiesManager.instance;
  }

  public addParty(lobby: Lobby): void {
    try {
      const newParty = this.createParty(lobby);
      if (newParty) {
        this.parties.push(newParty);
      }
    } catch (error) {
      log.error(`In PartiesManager, problem when adding a party: ${error}`);
    }
  }

  public addSoloParty(
    playerSocket: SocketIO.Socket,
    gameName: string,
    pseudo = "Not named Player"
  ) {
    try {
      const tempLobbyUser = new LobbyUser(playerSocket, pseudo);
      const newParty = this.createSoloParty(tempLobbyUser, gameName);
      if (newParty) {
        this.parties.push(newParty);
      } else {
        throw `Cannot create new solo party with player with socket id: ${playerSocket.id}, newParty is undefined`;
      }
    } catch (error) {
      log.error(`Problem in method addSoloParty(): ${error}`);
    }
  }

  public playerLoadedTheGame(playerSocket: SocketIO.Socket): void {
    try {
      // First we search if player exists, and get his IngamePlayer's ref
      const ingamePlayer = this.getIngamePlayerWithSocketId(playerSocket.id);
      if (ingamePlayer === null) {
        throw this.errorNoPlayerFoundWithThisSocketId(playerSocket.id);
      }
      // We verify ingamePlayer hasn't already loaded the game
      if (ingamePlayer.hasLoadedGame) {
        throw `Player with socket's id ${playerSocket.id} has already loaded the game, there must be a problem somewhere`;
      }
      // Then, we change the property hasLoadedGame
      ingamePlayer.hasLoadedGame = true;
    } catch (error) {
      log.error(`Problem in method playerLoadedTheGame(): ${error}`);
    }
  }

  public playerSendInputs(
    playerSocket: SocketIO.Socket,
    input: PlayerInput
  ): void {
    try {
      const player = this.getIngamePlayerWithSocketId(playerSocket.id);
      if (!player) {
        throw this.errorNoPlayerFoundWithThisSocketId(playerSocket.id);
      }
      player.input = input;
    } catch (error) {
      log.error(`Problem in method playerSendInputs(): ${error}`);
    }
  }

  public playerDisconnected(playerSocket: SocketIO.Socket): void {
    try {
      // Firest we search if player exists, and get his IngamePlayer's ref
      const ingamePlayer = this.getIngamePlayerWithSocketId(playerSocket.id);
      if (ingamePlayer === null) {
        throw this.errorNoPlayerFoundWithThisSocketId(playerSocket.id);
      }
      ingamePlayer.isDisconnected = true;
    } catch (error) {
      log.error(`Problem in method playerDisconnected(): ${error}`);
    }
  }

  private getIngamePlayerWithSocketId(
    playerSocketId: string
  ): IngamePlayer | null {
    let playerSearched: IngamePlayer | null = null;
    for (let party of this.parties) {
      playerSearched = party.getPlayerWithId(playerSocketId);
      if (playerSearched) {
        break;
      }
    }
    return playerSearched;
  }

  /**
   * Call update loop in parties 10 times by second
   */
  private initLoopUpdate(): void {
    setInterval(() => {
      this.parties.forEach((party) => {
        if (party.getGameState() === GenericGameState.Running) {
          party.updateLoop();
          party.sendDataToClients();
        } else if (party.getGameState() === GenericGameState.Loading) {
          party.checkIfPartyHasFinishedLoadingAndStartIt();
        }
      });
    }, 1000); // For debug, each second. TODO: put 100 back
  }

  private createParty(lobby: Lobby): IParty | undefined {
    let newParty: IParty;
    switch (lobby.lobbyType) {
      case "tetris":
        newParty = new TetrisParty({ lobby, id: this.getIdToParty() });
        return newParty;
      default:
        throw `Lobby with id ${lobby.getId()} doesn't have a valid lobby type: ${
          lobby.lobbyType
        }`;
    }
  }

  private createSoloParty(
    player: LobbyUser,
    gameName: string
  ): IParty | undefined {
    let newParty: IParty;
    switch (gameName) {
      case "tetris":
        newParty = new TetrisParty({ player, id: this.getIdToParty() });
        return newParty;
      default:
        throw `Can't create a new solo party with that game name: ${gameName}`;
    }
  }

  private getIdToParty(): string {
    return (this.idUsedIncrementator++).toString();
  }

  private errorNoPlayerFoundWithThisSocketId(playerSocketId: string): string {
    return `No player with socket's id ${playerSocketId} found in a party`;
  }
}
