import { TetrisGameData } from "../../../../../../share/types/tetris/tetrisGameData";

// Not type safe for now, to further amelioration, search vuex-module-decorator
export default {
  state: {
    gameData: null,
    canLoadTetrisPartyComponent: false
  },

  getters: {
    getFullGameData: (state: StateParty) => state.gameData,
    getOwnGameData: (state: StateParty) => state.gameData.privateData,
    getOtherPlayersGameData: (state: StateParty) => state.gameData.otherPlayersData,
    getCanLoadTetrisPartyComponent: (state: StateParty) => state.canLoadTetrisPartyComponent
  },

  mutations: {
    setGameData: (state: StateParty, gameData: TetrisGameData) => state.gameData = gameData,
    setcanLoadTetrisPartyComponent: (state: StateParty) => state.canLoadTetrisPartyComponent = true
  }
};

export interface StateParty {
  gameData: TetrisGameData,
  canLoadTetrisPartyComponent: boolean
}
