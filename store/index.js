import {
  SET_LOADING,
  SET_IS_PC,
  SET_IS_SIDEBAR_COLLAPSED,
  ADD_PROJECT,
  ADD_CATEGORY,
  ADD_API_CATEGORY,
  SET_IS_CATEGORY,
  SET_IS_API_CATEGORY,
  SET_IS_DB_SCHEMA,
  ADD_DB_SCHEMA,
  RESET_DATA,
  COPY_TESTCASE_INPUT,
  COPY_TESTCASE_OUTPUT,
  CLEAR_CLIPBOARD_DATA,
  COPY_TESTCASE_MATRIX
} from '~/constants/mutation-types'

export const state = () => ({
  loading: false,
  isPC: true,
  isSidebarCollapsed: false,
  project: {
    id: 0,
    name: ''
  },
  category: {
    id: 0,
    name: ''
  },
  apiCategory: {
    id: 0,
    name: ''
  },
  dbSchema: {
    id: 0,
    name: ''
  },
  isCategory: false,
  isApiCategory: false,
  isDbSchema: false,
  testcase_matrix_inputs: null,
  testcase_matrix_outputs: null,
  testcase_matrix: null
})

export const getters = {
  loading: state => state.loading,
  isPC: state => state.isPC,
  isSidebarCollapsed: state => state.isSidebarCollapsed,
  project: state => state.project,
  category: state => state.category,
  apiCategory: state => state.apiCategory,
  dbSchema: state => state.dbSchema,
  isCategory: state => state.isCategory,
  isApiCategory: state => state.isApiCategory,
  isDbSchema: state => state.isDbSchema
}

export const mutations = {
  [SET_LOADING]: (state, payload) => {
    state.loading = payload
  },
  [SET_IS_PC]: (state, payload) => {
    state.isPC = payload
  },
  [SET_IS_SIDEBAR_COLLAPSED]: (state, payload) => {
    state.isSidebarCollapsed = payload
  },
  [ADD_PROJECT]: (state, data) => {
    state.project = data
  },
  [ADD_CATEGORY]: (state, data) => {
    state.category = data
  },
  [ADD_API_CATEGORY]: (state, data) => {
    state.apiCategory = data
  },
  [ADD_DB_SCHEMA]: (state, data) => {
    state.dbSchema = data
  },
  [SET_IS_CATEGORY]: (state, payload) => {
    state.isCategory = payload
  },
  [SET_IS_API_CATEGORY]: (state, payload) => {
    state.isApiCategory = payload
  },
  [SET_IS_DB_SCHEMA]: (state, payload) => {
    state.isDbSchema = payload
  },

  [RESET_DATA]: (state, payload) => {
    state.project = {
      id: 0,
      name: ''
    }
    state.category = {
      id: 0,
      name: ''
    }
    state.apiCategory = {
      id: 0,
      name: ''
    }
    state.dbSchema = {
      id: 0,
      name: ''
    }
    state.isCategory = false
    state.isApiCategory = false
    state.isDbSchema = false
  },

  [COPY_TESTCASE_INPUT]: (state, payload) => {
    state.testcase_matrix_inputs = payload
  },

  [COPY_TESTCASE_OUTPUT]: (state, payload) => {
    state.testcase_matrix_outputs = payload
  },
  [COPY_TESTCASE_MATRIX]: (state, payload) => {
    state.testcase_matrix = payload
  },

  [CLEAR_CLIPBOARD_DATA]: (state, payload) => {
    state.testcase_matrix_inputs = null
    state.testcase_matrix_outputs = null
    state.testcase_matrix = null
  }
}

export const actions = {
  /**
   * Set loading global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  setLoading({ commit }, payload) {
    commit(SET_LOADING, payload)
  },
  /**
   * Add id project
   *
   * @param {Function} commit
   * @param {Object} itemCart
   */
  addProject({ commit, state }, data) {
    commit(ADD_PROJECT, data)
  },
  /**
   * Add id project
   *
   * @param {Function} commit
   * @param {Object} itemCart
   */
  addCategory({ commit, state }, data) {
    commit(ADD_CATEGORY, data)
  },

  /**
   * Add id api category
   *
   * @param {Function} commit
   * @param {Object} itemCart
   */
  addApiCategory({ commit, state }, data) {
    commit(ADD_API_CATEGORY, data)
  },

  /**
   * Add id api category
   *
   * @param {Function} commit
   * @param {Object} itemCart
   */
  addDbSchema({ commit, state }, data) {
    commit(ADD_DB_SCHEMA, data)
  },

  /**
   * Set isCategory global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  setIsCategory({ commit }, payload) {
    commit(SET_IS_CATEGORY, payload)
  },

  /**
   * Set isApiCategory global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  setIsApiCategory({ commit }, payload) {
    commit(SET_IS_API_CATEGORY, payload)
  },

  /**
   * Set isDbSchema global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  setIsDbSchema({ commit }, payload) {
    commit(SET_IS_DB_SCHEMA, payload)
  },
  /**
   * Set isDbSchema global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  resetData({ commit }, payload) {
    commit(RESET_DATA, payload)
  },

  /**
   * Set isDbSchema global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  copyTestCaseMatrixInput({ commit }, payload) {
    commit(COPY_TESTCASE_INPUT, payload)
  },

  /**
   * Set isDbSchema global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  copyTestCaseMatrixOutput({ commit }, payload) {
    commit(COPY_TESTCASE_OUTPUT, payload)
  },

  /**
   * Set isDbSchema global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  copyTestCaseMatrix({ commit }, payload) {
    commit(COPY_TESTCASE_MATRIX, payload)
  },

  /**
   * Set isDbSchema global
   *
   * @param {Function} commit
   * @param {Boolean} payload
   */
  clearClipboardData({ commit }, payload) {
    commit(CLEAR_CLIPBOARD_DATA, payload)
  }
}
