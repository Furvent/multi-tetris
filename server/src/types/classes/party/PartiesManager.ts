import { IParty } from "../../interfaces/IParty";

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

  public addParty(party: IParty): void {
    party.id = this.addIdToIParty();
    this.parties.push(party);
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

  private addIdToIParty(): string {
    return (this.idUsedIncrementator++).toString();
  }
}
