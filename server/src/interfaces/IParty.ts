import { IngamePlayer } from "../party/IngamePlayer";
import { GenericGameState } from "../party/enum/GameState";

export abstract class IParty {
  protected abstract players: IngamePlayer[];
  protected abstract id: string;
  protected abstract gameState: GenericGameState;

  abstract updateLoop(): void;
  abstract sendDataToClients(): void;
  abstract checkIfPartyHasFinishedLoadingAndStartIt(): void;
  abstract getId(): string;
  abstract getPlayerWithId(playerSocketId: string): IngamePlayer | null;
  abstract getGameState(): GenericGameState;
  protected abstract connectPlayersSocketsToSocketIORoomAndLoadEventsListener(): void;
}
