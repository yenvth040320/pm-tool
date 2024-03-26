export default $axios => ({
  resource: 'apiParameter',

  createParameter(data, config = {}) {
    return $axios.post(`${this.resource}/create-parameter`, data, config)
  },

  updateParameter(data, config = {}) {
    return $axios.post(`${this.resource}/update-parameter`, data, config)
  },

  updateMulti(data, config = {}) {
    return $axios.post(`${this.resource}/update-multi`, data, config)
  }
})
