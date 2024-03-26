export default $axios => ({
  resource: 'checklist',

  getDataChecklist(config = {}) {
    return $axios.get(`${this.resource}/manage`, config)
  }
})
