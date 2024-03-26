/*
 * Copyright 2020 Digi Dinos JSC. All rights reserved.
 * Email: tech@digidinos.com.
 */

import { notification } from 'ant-design-vue'

import CreateRepository from '~/repositories/service.container'

export default ({ $axios, app }, inject) => {
  $axios.setHeader('project', app.store.state.project.id)
  $axios.onError(error => {
    if (error.response && error.response.status === 401) {
      app.$auth.reset()
    }

    if (error.response && error.response.status === 403) {
      notification.error({
        message: 'Bạn không có quyền thao tác'
      })
      throw new Error('Permission denied!')
    }

    return Promise.reject(error)
  })

  inject('api', CreateRepository($axios))
}
