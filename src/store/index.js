import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        account: null,
    },
    mutations: {
        updataAccount(state, val) {
            state.account = val
        },
    },
})

export default store
