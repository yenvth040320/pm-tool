export default $axios => ({
  resource: 'task',

  listMemberApproves(config = {}) {
    return $axios.get(`${this.resource}/list-member-approve`, config)
  },

  getLeaders(config = {}) {
    return $axios.get(`${this.resource}/list-leader`, config)
  },

  getKpis(config = {}) {
    return $axios.get(`${this.resource}/kpi`, config)
  },

  getSupportMember(config = {}) {
    return $axios.get(`${this.resource}/support-member`, config)
  },

  /**
   * Upload image content
   *
   * @returns {Object}
   */
  uploadImageContent(data, config = {}) {
    return $axios.post(`${this.resource}/image/upload`, data, config)
  },

  /**
   * Upload image content
   *
   * @returns {Object}
   */
  listFunction(config = {}) {
    return $axios.get(`${this.resource}/list-function`, config)
  },

  listMstLifeCycles(config = {}) {
    return $axios.get(`${this.resource}/mstLifeCycles`, config)
  },

  /**
   * Update resource
   *
   * @param {Number} id
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  approveTask(id, data, config = {}) {
    return $axios.post(`${this.resource}/approve/${id}`, data, config)
  },

  /**
   * Update resource
   *
   * @param {Number} id
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  unApproveTask(id, data, config = {}) {
    return $axios.post(`${this.resource}/un-approve/${id}`, data, config)
  },

  /**
   * Update resource
   *
   * @param {Number} id
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  updateTask(id, data, config = {}) {
    return $axios.post(`${this.resource}/update/${id}`, data, config)
  },

  /**
   * Update resource
   *
   * @param {Number} id
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  createTaskFile(id, data, config = {}) {
    return $axios.post(`${this.resource}/upload-file/${id}`, data, config)
  },

  /**
   * List check list
   *
   * @returns {Object}
   */
  listCheckList(config = {}) {
    return $axios.get(`${this.resource}/list-checklist`, config)
  },

  /**
   * List check list
   *
   * @returns {Object}
   */
  listCheckListTask(config = {}) {
    return $axios.get(`${this.resource}/list-checklist-task`, config)
  },

  temporarilyChecklist(data, config = {}) {
    return $axios.post(`${this.resource}/temporarily-checklist`, data, config)
  },

  temporarilyChecklistTask(data, config = {}) {
    return $axios.post(`${this.resource}/temporarily-checklist-task`, data, config)
  },

  /**
   * Show detail resource
   *
   * @param {Number} id
   * @param {Object} config
   * @returns {Object}
   */
  showProject(config = {}) {
    return $axios.get(`${this.resource}/show-project`, config)
  },

  /**
   * List check list
   *
   * @returns {Object}
   */
  listFunctionEtPoint(config = {}) {
    return $axios.get(`${this.resource}/functionEtPoint`, config)
  },

  /**
   * List check list
   *
   * @returns {Object}
   */
  listProjectEtPoint(config = {}) {
    return $axios.get(`${this.resource}/projectEtPoint`, config)
  },

  listHome(config = {}) {
    return $axios.get(`${this.resource}/home-list`, config)
  },

  listOwner(config = {}) {
    return $axios.get(`${this.resource}/owner-list`, config)
  },

  multiCreate(data, config = {}) {
    return $axios.post(`${this.resource}/multi-create`, data, config)
  },

  saveTask(data, config = {}) {
    return $axios.post(`${this.resource}/create-task`, data, config)
  },

  getTaskOfEveryBody(config = {}) {
    return $axios.get(`${this.resource}/list-task-follow-date`, config)
  },

  getProjectCompletionProgress(config = {}) {
    return $axios.get(`${this.resource}/project-completion-progress`, config)
  },

  getListTasksOfBug(config = {}) {
    return $axios.get(`${this.resource}/task-of-bug`, config)
  },

  getListMstLifeCyclesForTaskEdit(config = {}) {
    return $axios.get(`${this.resource}/list-mst-life-cycle-for-edit`, config)
  }
})
