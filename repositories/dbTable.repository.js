export default $axios => ({
  resource: 'dbTable',

  increaseVersion(id, data, config = {}) {
    return $axios.post(`${this.resource}/increaseVersion/${id}`, data, config)
  },

  createDbTable(data, config = {}) {
    return $axios.post(`${this.resource}/create-dbTable`, data, config)
  },

  updateDbTable(id, data, config = {}) {
    return $axios.post(`${this.resource}/update-dbTable/${id}`, data, config)
  },

  updateMulti(id, data, config = {}) {
    return $axios.post(`${this.resource}/update-multi/${id}`, data, config)
  }
})
