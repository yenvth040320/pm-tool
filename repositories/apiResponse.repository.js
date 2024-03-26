export default $axios => ({
  resource: 'apiResponse',

  createResponse(data, config = {}) {
    return $axios.post(`${this.resource}/create-response`, data, config)
  },

  updateResponse(data, config = {}) {
    return $axios.post(`${this.resource}/update-response`, data, config)
  },

  updateMulti(data, config = {}) {
    return $axios.post(`${this.resource}/update-multi`, data, config)
  }
})
