export default $axios => ({
  resource: 'requirementFunction',

  getListFunctionInfluence(data, config = {}) {
    return $axios.get(`${this.resource}/list-function-influence`, data, config)
  },

  createFunctionRequirement(data, config = {}) {
    return $axios.post(`${this.resource}/create-function-requirement`, data, config)
  },

  createItemAndEvent(data, config = {}) {
    return $axios.post(`${this.resource}/create-item-and-event`, data, config)
  },

  approveAll(data, config = {}) {
    return $axios.post(`${this.resource}/approve-all`, data, config)
  }
})
