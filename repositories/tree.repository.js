export default $axios => ({
  resource: 'tree',

  /**
   * Change position tree.
   *
   * @returns {Object}
   */
  changePositionTree(data, config = {}) {
    return $axios.post(`${this.resource}/change-position`, data, config)
  },

  /**
   * Analystics data
   * @param {*} data
   * @param {*} config
   * @returns
   */
  analyticsTree(data, config = {}) {
    return $axios.get(`${this.resource}/analytics-dataGitlab`, data, config)
  },

  /**
   * Sync data
   */
  syncTree(data, config = {}) {
    return $axios.get(`${this.resource}/sync-dataGitlab`, data, config)
  },

  /**
   * Sync data
   */
  getMethodCall(data, config = {}) {
    return $axios.get(`${this.resource}/get-method-call`, data, config)
  },

  /**
   * Get list resources
   *
   * @param {Object} config
   * @returns {Object}
   */
  listFile(config = {}) {
    return $axios.get(`${this.resource}/get-list-file`, config)
  },

  /**
   * Clear cache branch.
   */
  clearCacheBranch(data) {
    return $axios.post(`${this.resource}/clear-cache-branch`, data)
  }
})
