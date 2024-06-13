import defaultSettings from '@/settings'
import {getEnumMap, login} from "@/api/user";
import {encryptJSEncrypt} from "@/utils/jSEncrypt";
import {setToken} from "@/utils/auth";

const {showSettings, fixedHeader, sidebarLogo} = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  optionMap: {},
}

const mutations = {
  CHANGE_SETTING: (state, {key, value}) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },

  setOptionMap: (state, data) => {
    state.optionMap = data
  }
}

const actions = {
  changeSetting({commit}, data) {
    commit('CHANGE_SETTING', data)
  },

  async getOptionMap({commit}, data) {
    return new Promise((resolve, reject) => {
      try {
        getEnumMap().then(response => {
          commit('setOptionMap', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      } catch (e) {
        console.log(e);
      }

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

