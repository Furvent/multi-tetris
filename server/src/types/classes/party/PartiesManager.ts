import { IParty } from "../../interfaces/IParty";
import { Lobby } from "../Lobby";
import log from "../../../private-module/PrivateLogger";
import { TetrisParty } from "../../tetris/classes/TetrisParty";

/**
 * TODO: utiliser un module de création d'id pour les parties. Peut être même
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

  /**
   * Call update loop in parties 10 times by second
   */
  private initLoopUpdate(): void {
    setInterval(() => {
      this.parties.forEach((party) => {
        party.updateLoop();
        party.sendDataToClient();
      });
    }, 100);
  }

  private createParty(lobby: Lobby): IParty | undefined {
    let newParty: IParty;
    switch (lobby.lobbyType) {
      case "tetris":
        newParty = new TetrisParty(lobby, this.addIdToIParty());
        return newParty;
      default:
        throw `Lobby with id ${lobby.getId()} doesn't have a valid lobby type: ${
          lobby.lobbyType
        }`;
    }
  }

  private addIdToIParty(): string {
    return (this.idUsedIncrementator++).toString();
  }
}
