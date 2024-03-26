export default $axios => ({
  resource: 'dbTableVersion',

  getDetail(config = {}) {
    return $axios.get(`${this.resource}/detail`, config)
  }
})
