import { TetrisGameData, BoardDimension } from "../../../../../../share/types/tetris/tetrisGameData";

// Not type safe for now, to further amelioration, search vuex-module-decorator
export default {
  state: {
    gameData: null,
    canLoadTetrisPartyComponent: false,
    numberOfPlayer: 0,
    boardDimension: null,
  },

  getters: {
    getFullGameData: (state: StateParty) => state.gameData,
    getLocalPlayerData: (state: StateParty) => state.gameData.privateData || null,
    getOthersPlayersData: (state: StateParty) => state.gameData.othersPlayersData || null,
    getOwnGameData: (state: StateParty) => state.gameData.privateData,
    getOtherPlayersGameData: (state: StateParty) =>
      state.gameData.othersPlayersData,
    getCanLoadTetrisPartyComponent: (state: StateParty) =>
      state.canLoadTetrisPartyComponent,
    getNumberOfPlayer: (state: StateParty) => state.numberOfPlayer,
    getBoardDimension: (state: StateParty) => state.numberOfPlayer,
  },

  mutations: {
    setGameData: (state: StateParty, gameData: TetrisGameData) =>
      (state.gameData = gameData),
    setcanLoadTetrisPartyComponent: (state: StateParty) =>
      (state.canLoadTetrisPartyComponent = true),
    setNumberOfPlayer: (state: StateParty, value: number) =>
      (state.numberOfPlayer = value),
    setBoardDimension: (state: StateParty, value: BoardDimension) =>
      (state.boardDimension = value),
  },
};

export interface StateParty {
  gameData: TetrisGameData;
  canLoadTetrisPartyComponent: boolean;
  numberOfPlayer: number;
  boardDimension: BoardDimension;
}
