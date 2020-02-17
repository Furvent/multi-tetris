import { PayloadPublicLobby } from "../../../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../../../share/types/PayloadPrivateLobby";

// Not type safe for now, to further amelioration, search vuex-module-decorator
export default {
  state: {
    testingDatum: "boblebob",
    publicLobbies: new Array(),
    privateLobby: {},
    playerSocket: undefined
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
    },
    getPlayerSocket: (state: State) => {
      return state.playerSocket
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
    },
    setPlayerSocket: (state: State, socket: SocketIOClient.Socket) => {
      state.playerSocket = socket
    }
  }
};

export interface State {
  testingDatum: string;
  publicLobbies: PayloadPublicLobby[];
  privateLobby: PayloadPrivateLobby;
  playerSocket: SocketIOClient.Socket
}
