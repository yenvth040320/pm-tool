export default $axios => ({
  resource: 'bug',

  /**
   * Upload image content
   *
   * @returns {Object}
   */
  uploadImageContent(data, config = {}) {
    return $axios.post(`${this.resource}/upload-image`, data, config)
  },

  /**
   * add bug note
   *
   * @param {Number} id
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  addBugNote(id, data, config = {}) {
    return $axios.post(`${this.resource}/add-note/${id}`, data, config)
  },

  /**
   * Update bug
   *
   * @param {Number} id
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  updateBug(id, data, config = {}) {
    return $axios.post(`${this.resource}/update/${id}`, data, config)
  }
})
