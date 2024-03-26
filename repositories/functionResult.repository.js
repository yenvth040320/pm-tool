export default $axios => ({
  resource: 'functionResult',

  getFunctionList(config = {}) {
    return $axios.get(`${this.resource}/get-function-list`, config)
  },

  getFunctionVersionList(config = {}) {
    return $axios.get(`${this.resource}/get-function-version-list`, config)
  },

  getListFunctionResultToSelect(config = {}) {
    return $axios.get(`${this.resource}/get-list-select`, config)
  }
})
