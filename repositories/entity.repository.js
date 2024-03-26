export default $axios => ({
  resource: 'entity',

  getEntityRelation(config = {}) {
    return $axios.get(`${this.resource}/get-relationship`, config)
  },

  createMulti(data, config = {}) {
    return $axios.post(`${this.resource}/create-multi`, data, config)
  },

  updatePosition(data, config = {}) {
    return $axios.post(`${this.resource}/update-position`, data, config)
  }
})
