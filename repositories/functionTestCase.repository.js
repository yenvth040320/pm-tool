export default $axios => ({
  resource: 'functionTestCase',

  copyAll(data, config = {}) {
    return $axios.post(`${this.resource}/copy`, data, config)
  },

  copySingle(data, config = {}) {
    return $axios.post(`${this.resource}/copy-single`, data, config)
  }
})
