export default $axios => ({
  resource: 'functionResultDetail',

  createFunctionResultDetail(data, config = {}) {
    return $axios.post(`${this.resource}`, data, config)
  }
})
