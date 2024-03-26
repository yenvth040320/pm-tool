export default $axios => ({
  resource: 'caseTest',

  /**
   * get case test list
   *
   * @param {Object} config
   * @returns {Object}
   */
  list(config = {}) {
    return $axios.get(`${this.resource}/list`, config)
  },

  /**
   * Update resource
   *
   * @param {Number} id
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  update(id, data, config = {}) {
    return $axios.put(`${this.resource}/update/${id}`, data, config)
  }
})
