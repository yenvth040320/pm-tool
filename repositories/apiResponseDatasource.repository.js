export default $axios => ({
  resource: 'apiResponseDatasource',

  multiUpdate(data, config = {}) {
    return $axios.post(`${this.resource}/multi-update`, data, config)
  }
})
