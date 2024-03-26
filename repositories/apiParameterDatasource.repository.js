export default $axios => ({
  resource: 'apiParameterDatasource',

  multiUpdate(data, config = {}) {
    return $axios.post(`${this.resource}/multi-update`, data, config)
  }
})
