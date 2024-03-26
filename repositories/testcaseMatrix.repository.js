export default $axios => ({
  resource: 'testcaseMatrix',

  /**
   * Auto create testcase table
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  autoCreate(data, config = {}) {
    return $axios.post(`${this.resource}/auto-create`, data, config)
  },

  /**
   * Get function testcase matrix
   *
   * @param {Object} config
   * @returns {Object}
   */
  getFunctionTestcaseMatrix(config = {}) {
    return $axios.get(`${this.resource}/get-function-testcase-matrix`, config)
  },

  /**
   * Get function testcase detail
   *
   * @param {Object} config
   * @returns {Object}
   */
  getFunctionTestcaseDetail(config = {}) {
    return $axios.get(`${this.resource}/get-function-testcase-detail`, config)
  },

  /**
   * Save data tab testcase matrix
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  saveTabTestcaseMatrix(data, config = {}) {
    return $axios.post(`${this.resource}/save-all-tab`, data, config)
  },

  /**
   * Save data tab testcase matrix
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  saveTestcaseMatrix(data, config = {}) {
    return $axios.post(`${this.resource}/save-matrix`, data, config)
  },

  /**
   * Update order
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  updateOrder(data, config = {}) {
    return $axios.post(`${this.resource}/update-order`, data, config)
  },

  /**
   * Copy test case
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  copyTestCase(data, config = {}) {
    return $axios.post(`${this.resource}/copy`, data, config)
  },

  /**
   * Copy code
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  copyCodeTestCase(data, config = {}) {
    return $axios.post(`${this.resource}/copy-code`, data, config)
  },

  /**
   * Copy all code test case
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  copyCodeTestCaseForItem(data, config = {}) {
    return $axios.post(`${this.resource}/copy-code-for-item`, data, config)
  },

  /**
   * Copy all code test case
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  copyCodeTestCaseForFunction(data, config = {}) {
    return $axios.post(`${this.resource}/copy-code-for-function`, data, config)
  }
})
