export default $axios => ({
  resource: 'actor',

  createAction(data, config = {}) {
    return $axios.post(`${this.resource}/create-action`, data, config)
  }
})
