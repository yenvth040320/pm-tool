export default $axios => ({
  resource: 'requirementEstimate',

  createOrUpdateEstimate(data, config = {}) {
    return $axios.post(`${this.resource}/add-task-private`, data, config)
  },

  createOrUpdateEstimateCommon(data, config = {}) {
    return $axios.post(`${this.resource}/add-task-common`, data, config)
  },

  approveAll(data, config = {}) {
    return $axios.post(`${this.resource}/approve-all`, data, config)
  },

  exportEstimate(data, config = {}) {
    return $axios.post(`${this.resource}/export-estimate`, data, config)
  }
})
