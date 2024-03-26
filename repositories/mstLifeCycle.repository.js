export default $axios => ({
  resource: 'mstLifeCycle',

  /**
   * Get list mstLifeCycles for Qa Detail Screen
   *
   * @param {Object} config
   * @returns {Object}
   */
  listForQaDetail(config = {}) {
    return $axios.get(`${this.resource}/list-for-qa-detail`, config)
  }
})
