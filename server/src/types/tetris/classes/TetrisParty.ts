import { IParty } from "../../interfaces/IParty";

export class TetrisParty implements IParty {
  id: string;

  constructor(id: string) {
    this.id = id
  }

  updateLoop() {
    throw new Error("Method not implemented.");
  }

  sendDataToClient() {
    throw new Error("Method not implemented.");
  }
  
}