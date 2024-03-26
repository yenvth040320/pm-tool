export default $axios => ({
  resource: 'branch',

  syncBranch(data, config = {}) {
    return $axios.get(`${this.resource}/sync-branch`, data, config)
  }
})
