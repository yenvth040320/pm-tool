export default $axios => ({
  resource: 'flowFile',

  /**
     * Update item
     *
     * @returns {Object}
     */
  updateItem(id, data, config = {}) {
    return $axios.post(`${this.resource}/${id}`, data, config)
  }
})
