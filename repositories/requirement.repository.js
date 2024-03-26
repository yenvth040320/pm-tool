export default $axios => ({
  resource: 'requirement',

  /**
   * Upload image content
   *
   * @returns {Object}
   */
  uploadImageContent(data, config = {}) {
    return $axios.post(`${this.resource}/upload-image`, data, config)
  },

  addReply(id, data, config = {}) {
    return $axios.post(`${this.resource}/add-reply/${id}`, data, config)
  },

  getDataTabSchedule(config = {}) {
    return $axios.get(`${this.resource}/tab-schedule`, config)
  },

  saveRequirementSchedule(data, config = {}) {
    return $axios.post(`${this.resource}/save-schedule`, data, config)
  },

  updatePoint(id, data, config = {}) {
    return $axios.post(`${this.resource}/update-point/${id}`, data, config)
  },

  updateRequirement(id, data, config = {}) {
    return $axios.post(`${this.resource}/update-content/${id}`, data, config)
  }
})
