export default $axios => ({
  resource: 'testcaseOutputResultDetail',

  multiStore(data, config = {}) {
    return $axios.post(`${this.resource}/multiStore`, data, config)
  }
})
