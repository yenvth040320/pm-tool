export default $axios => ({
  resource: 'functionItemReadDatasource',
  /**
   * Update resource
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  update(data, config = {}) {
    return $axios.post(`${this.resource}/update`, data, config)
  }
})
