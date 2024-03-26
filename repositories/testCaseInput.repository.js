export default $axios => ({
  resource: 'testCaseInput',

  /**
   * Save data case test
   *
   * @param {Object} config
   * @returns {Object}
   */
  saveCaseTest(config = {}) {
    return $axios.post(`${this.resource}/save-case-test`, config)
  },

  /**
   * Delete data case test
   *
   * @param {Object} config
   * @returns {Object}
   */
  deleteRecordCaseTest(id, config = {}) {
    return $axios.post(`${this.resource}/delete-case-test/${id}`, config)
  },

  /**
   * Update order
   *
   * @param {Object} config
   * @returns {Object}
   */
  updateOrder(config = {}) {
    return $axios.post(`${this.resource}/update-order`, config)
  },

  /**
   * Update order case test
   *
   * @param {Object} config
   * @returns {Object}
   */
  updateOrderCaseTest(config = {}) {
    return $axios.post(`${this.resource}/update-order-case-test`, config)
  },

  /**
   * Get list case test
   *
   * @param {Object} config
   * @returns {Object}
   */
  getListCaseTest(config = {}) {
    return $axios.get(`${this.resource}/list-case-test`, config)
  },

  getMapCaseTest(config = {}) {
    return $axios.get(`${this.resource}/get-map-case-test`, config)
  },

  getConditionShowButtonCopy(config = {}) {
    return $axios.get(`${this.resource}/check-copy-test-case`, config)
  },

  copyTestCase(data, config = {}) {
    return $axios.post(`${this.resource}/copy-testcase`, data, config)
  }
})
