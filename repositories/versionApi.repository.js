export default $axios => ({
  resource: 'versionApi',

  getDetail(config = {}) {
    return $axios.get(`${this.resource}/detail`, config)
  }
})
