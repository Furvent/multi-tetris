import { IngamePlayer } from "../classes/party/IngamePlayer";
import { Lobby } from "../classes/Lobby";

export abstract class IParty {
  protected abstract players: IngamePlayer[];
  protected abstract id: string;
  protected abstract gameState: string;

  abstract updateLoop(): void;
  abstract sendDataToClients(): void;
  abstract getId(): string;
  protected abstract connectPlayersSocketsToSocketIORoomAndLoadEventsListener(): void;
}
