export default $axios => ({
  resource: 'api',

  increaseVersion(id, data, config = {}) {
    return $axios.post(`${this.resource}/increaseVersion/${id}`, data, config)
  },

  /**
   * Get list resources
   *
   * @param {Object} config
   * @returns {Object}
   */
  listApiUsed(config = {}) {
    return $axios.get(`${this.resource}/used`, config)
  }
})
