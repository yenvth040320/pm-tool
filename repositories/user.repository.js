export default $axios => ({
  resource: 'user',

  getGroupMembers(config = {}) {
    return $axios.get(`${this.resource}/get-group-member`, config)
  },

  getListUser(config = {}) {
    return $axios.get(`${this.resource}/list`, config)
  },

  checkUser(config = {}) {
    return $axios.get(`${this.resource}/check-user`, config)
  }
})
