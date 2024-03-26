export default $axios => ({
  resource: 'project',

  /**
   * Copy master data from project.
   *
   * @param {Object} data
   * @param {Object} config
   * @return {Object}
   */
  copyData(data, config = {}) {
    return $axios.post(`${this.resource}/copy`, data, config)
  },

  exportExcel(data, config = {}) {
    return $axios.post(`${this.resource}/export-report-excel`, data, config)
  },

  saveMember(id, data, config = {}) {
    return $axios.post(`${this.resource}/save-member/${id}`, data, config)
  },

  getWorkingPrj(config = {}) {
    return $axios.get(`${this.resource}/get-working-project`, config)
  },

  distributePoint(data, config = {}) {
    return $axios.post(`${this.resource}/distribute-point`, data, config)
  },

  listMemberOfProject(id, config = {}) {
    return $axios.get(`${this.resource}/member/${id}`, config)
  }
})
