export default $axios => ({
  resource: 'functionItemLanguageKey',

  multiStore(data, config = {}) {
    return $axios.post(`${this.resource}/multi-store`, data, config)
  }
})
