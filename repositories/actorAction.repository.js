export default $axios => ({
  resource: 'actorAction',

  /**
   * Delete group action.
   *
   * @param {Object} data
   * @param {Object} config
   * @returns
   */
  deleteGroupAction(data, config = {}) {
    return $axios.post(`${this.resource}/delete-group-action`, data, config)
  }
})
