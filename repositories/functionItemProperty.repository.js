export default $axios => ({
  resource: 'functionItemProperty',

  updateProp(data, config = {}) {
    return $axios.post('functionItemProperty/update', data, config)
  },

  newProp(data, config = {}) {
    return $axios.post('functionItemProperty/new', data, config)
  }
})
