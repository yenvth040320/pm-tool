export default $axios => ({
  resource: 'supportMember',

  /**
   * Get list member
   *
   * @param {Object} config
   * @returns {Object}
   */
  listSupportMember(config = {}) {
    return $axios.get(`${this.resource}/get-supporter`, config)
  }
})
