import { IngamePlayer } from "../classes/party/IngamePlayer";

export interface IParty {
  players: IngamePlayer[];
  id: string;

  updateLoop();
  sendDataToClient();
  connectPartyToSocketIORoom();
}