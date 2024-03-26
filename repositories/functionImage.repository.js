export default $axios => ({
  resource: 'functionImage',
  /**
   * Upload
   *
   * @returns {Object}
   */
  upload(data, config = {}) {
    return $axios.post(`${this.resource}/upload`, data, config)
  },

  replaceImage(data, config = {}) {
    return $axios.post(`${this.resource}/replace`, data, config)
  }
})
