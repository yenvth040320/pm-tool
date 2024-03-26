export default $axios => ({
  resource: 'functionEvent',

  autoClassifyLevel(data, config = {}) {
    return $axios.post('functionEvent/auto-level', data, config)
  },

  updateLevel(id, data, config = {}) {
    return $axios.post(`functionEvent/update-level/${id}`, data, config)
  }
})
