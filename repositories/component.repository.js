export default $axios => ({
  resource: 'component',

  /**
   * Delete component and relationship component.
   *
   * @returns {Object}
   */
  deleteComponentRelationship(id, config = {}) {
    return $axios.delete(`${this.resource}/delete-relationship/${id}`, config)
  },

  /**
   * Get list component.
   *
   * @param {Object} config
   * @returns {Object}
   */
  listComponentFlowBranch(config = {}) {
    return $axios.get(`${this.resource}/component-merge/branch`, config)
  },

  /**
   * Merge component.
   *
   * @param {Object} config
   * @returns {Object}
   */
  mergeComponent(data) {
    return $axios.post(`${this.resource}/component-merge/branch`, data)
  },

  listSelectFunction(config = {}) {
    return $axios.get('function/select-list', config)
  }
})
