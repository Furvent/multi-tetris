import { PayloadPublicLobby } from "../../../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../../../share/types/PayloadPrivateLobby";

// Not type safe for now, to further amelioration, search vuex-module-decorator
export default {
  state: {
    testingDatum: "boblebob",
    publicLobbyes: new Array(),
    privateLobby: {}
  },

  getters: {
    getDatum: (state: State) => {
      return state.testingDatum;
    },
    getPublicLobbies: (state: State) => {
      return state.publicLobbies
    },
    getPrivateLobby: (state: State) => {
      return state.privateLobby
    }
  },

  mutations: {
    setDatum: (state: State, newDatum: string) => {
      state.testingDatum = newDatum;
    },
    setPublicLobbies: (state: State, lobbies: PayloadPublicLobby[]) => {
      state.publicLobbies = lobbies
    },
    setPrivateLobby: (state: State, lobby: PayloadPrivateLobby) => {
      state.privateLobby = lobby
    }
  }
};

interface State {
  testingDatum: string;
  publicLobbies: PayloadPublicLobby[];
  privateLobby: PayloadPrivateLobby;
}
