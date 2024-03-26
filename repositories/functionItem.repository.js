export default $axios => ({
  resource: 'functionItem',

  updateFunctionItem(data, config = {}) {
    return $axios.post('functionItem/update', data, config)
  },

  addDefault(data, config = {}) {
    return $axios.post('functionItem/add-default', data, config)
  },

  copy(data, config = {}) {
    return $axios.post('functionItem/copy', data, config)
  },

  updateItemNum(data, config = {}) {
    return $axios.post('functionItem/update-num', data, config)
  },

  syncHtml(id, config = {}) {
    return $axios.put(`${this.resource}/sync-html-id/${id}`, config)
  },

  getListFunctionItem(config = {}) {
    return $axios.get(`${this.resource}/list-function-item`, config)
  },

  updateUseFlgFunctionItem(id, data, config = {}) {
    return $axios.post(`${this.resource}/update-use-flg/${id}`, data, config)
  },

  resetAllHtmlId(data, config = {}) {
    return $axios.post(`${this.resource}/reset-all-html-id`, data, config)
  }
})
