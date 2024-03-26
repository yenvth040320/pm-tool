export default $axios => ({
  resource: 'apiSequenceDiagram',

  showApiSequenceDiagram(config = {}) {
    return $axios.get(`${this.resource}/show-api-sequence-diagram`, config)
  }
})
