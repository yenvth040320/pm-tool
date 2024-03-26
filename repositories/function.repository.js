export default $axios => ({
  resource: 'function',

  increaseVersion(id, data, config = {}) {
    return $axios.post(`${this.resource}/increaseVersion/${id}`, data, config)
  },

  exportExcel(data, config = {}) {
    return $axios.post('function/export-excel', data, config)
  },
  multiUpdate(data, config = {}) {
    return $axios.post(`${this.resource}/update-datasource`, data, config)
  },

  getDataTabSchedule(config = {}) {
    return $axios.get(`${this.resource}/tab-schedule`, config)
  },

  getDataTabProcess(config = {}) {
    return $axios.get(`${this.resource}/tab-process`, config)
  },

  lockAllVersion(data, config = {}) {
    return $axios.post(`${this.resource}/lock-all`, data, config)
  },

  increaseMultiVersion(data, config = {}) {
    return $axios.post(`${this.resource}/increase-multi-version`, data, config)
  },

  updateDescription(id, data, config = {}) {
    return $axios.post(`${this.resource}/update-description/${id}`, data, config)
  },

  getFunctionTestcase(config = {}) {
    return $axios.get(`${this.resource}/list-testcase`, config)
  },

  getListFunction(config = {}) {
    return $axios.get(`${this.resource}/list-function`, config)
  }
})
