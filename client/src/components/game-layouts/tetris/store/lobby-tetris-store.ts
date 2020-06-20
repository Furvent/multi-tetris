import { PayloadPublicLobby } from "../../../../../../share/types/PayloadPublicLobby";
import { PayloadPrivateLobby } from "../../../../../../share/types/PayloadPrivateLobby";

// Not type safe for now, to further amelioration, search vuex-module-decorator
export default {
  state: {
    playerPseudo: "",
    publicLobbies: new Array(),
    privateLobby: {},
    playerSocket: undefined
  },

  getters: {
    getOwnPseudo: (state: State) => {
      return state.playerPseudo;
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
    setOwnPseudo: (state: State, newPseudo: string) => {
      state.playerPseudo = newPseudo;
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
  playerPseudo: string;
  publicLobbies: PayloadPublicLobby[];
  privateLobby: PayloadPrivateLobby;
  playerSocket: SocketIOClient.Socket
}
