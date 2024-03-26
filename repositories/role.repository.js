export default $axios => ({
  resource: 'role',

  /**
   * Get list permissions
   *
   * @returns {Object}
   */
  getPermissions() {
    return $axios.get('/permissions')
  }
})
