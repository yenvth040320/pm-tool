export default $axios => ({
  resource: 'mstLifeCycleStatus',

  listColor(config = {}) {
    return $axios.get(`${this.resource}/color`, config)
  }
})
