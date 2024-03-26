export default $axios => ({
  resource: 'functionRelationshipItem',

  createOrUpdateMulti(data, config = {}) {
    return $axios.post('functionRelationshipItem/update-or-create', data, config)
  }
})
