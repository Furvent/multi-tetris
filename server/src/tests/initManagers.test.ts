import { PlayersManager } from "../types/classes/PlayersManager"
import { LobbiesManager } from "../types/classes/LobbiesManager"

PlayersManager.getInstance();
LobbiesManager.getInstance();

console.log("Tests launched");

if (process.env.NODE_ENV === "test") {
  console.log("You are in test env, indeed");
}