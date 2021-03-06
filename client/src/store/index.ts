import Vue from 'vue'
import Vuex from 'vuex'

import TetrisLobbyStore from '../components/game-layouts/tetris/store/lobby-tetris-store'
import TetrisPartyStore from '../components/game-layouts/tetris/store/party-tetris-store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    TetrisLobbyStore,
    TetrisPartyStore
  }
})
