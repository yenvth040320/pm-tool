export default $axios => ({
  resource: 'projectEtPoint',

  getPoints(config = {}) {
    return $axios.get(`${this.resource}/get-project-points`, config)
  }
})
