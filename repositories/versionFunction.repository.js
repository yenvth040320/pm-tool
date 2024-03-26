export default $axios => ({
  resource: 'versionFunction',

  getDetail(config = {}) {
    return $axios.get(`${this.resource}/detail`, config)
  },

  updateDiagramImage(data, config = {}) {
    return $axios.post(`${this.resource}/update-diagram-image`, data, config)
  },

  getListVersion(config = {}) {
    return $axios.get(`${this.resource}/list-version`, config)
  }
})
