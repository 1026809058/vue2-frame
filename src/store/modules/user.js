import { getAccessToken, setAccessToken } from "@/utils/accessToken";
const state = {
  accessToken: getAccessToken(),
  username: "",
  id: "",
};

const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  id: (state) => state.id,
};
const mutations = {
  /**
   * @description 设置accessToken
   * @param {*} state
   * @param {*} accessToken
   */
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username;
  },
  //设置用户id
  setUserId(state, id) {
    state.id = id;
  },
};
const actions = {};
export default { state, getters, mutations, actions };
