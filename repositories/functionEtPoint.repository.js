export default $axios => ({
  resource: 'functionEtPoint',

  getPoints(config = {}) {
    return $axios.get(`${this.resource}/get-points`, config)
  }
})
