export default $axios => ({
  resource: 'functionEventLogical',

  createLogic(data, config = {}) {
    return $axios.post(`${this.resource}/create-logic`, data, config)
  },

  updateContentJp(id, data, config = {}) {
    return $axios.post(`${this.resource}/update-content-jp/${id}`, data, config)
  }
})
