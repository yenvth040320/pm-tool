export default $axios => ({
  resource: 'testCaseOutput',

  /**
   * Update order
   *
   * @param {Object} config
   * @returns {Object}
   */
  updateOrder(config = {}) {
    return $axios.post(`${this.resource}/update-order`, config)
  }
})
