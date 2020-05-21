import { PlayersManager } from "../types/classes/PlayersManager"
import { LobbiesManager } from "../types/classes/LobbiesManager"

test("init managers", () => {
  console.log("Tests launched");
})

if (process.env.NODE_ENV === "test") {
  console.log("You are in test env, indeed");
}

console.log(LobbiesManager.getInstance().getLobbies());