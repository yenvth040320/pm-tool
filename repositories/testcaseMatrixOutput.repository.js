export default $axios => ({
  resource: 'testcaseMatrixOutput',

  /**
   * Change position testcase matrix input
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  updateOrder(data, config = {}) {
    return $axios.post(`${this.resource}/change-position`, data, config)
  }
})
