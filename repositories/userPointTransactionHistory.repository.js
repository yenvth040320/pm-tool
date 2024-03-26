export default $axios => ({
  resource: 'userPointTransactionHistory',

  listProject(config = {}) {
    return $axios.get(`${this.resource}/project-list`, config)
  },

  listApprovers(config = {}) {
    return $axios.get(`${this.resource}/approver-list`, config)
  },

  exportExcel(data, config = {}) {
    return $axios.post(`${this.resource}/export-excel`, data, config)
  }
})
