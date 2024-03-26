export default (context, inject) => {
  const antdvalidate = {
    /**
     *
     * @param {*} rule         // Default antdesign params
     * @param {*} value        // Default antdesign params - value of the field
     * @param {*} callback     // Default antdesign params - callback an error or valid
     * @param {*} data     //string
     * @returns
     */
    checkRequired: (rule, value, callback, data) => {
      try {
        const str = data.toString().trim()
        if (str === '') {
          return callback(
            new Error()
          )
        } else {
          callback()
        }
      } catch (error) {
        return callback(error)
      }
    },

    checkPointTaskLimit: (rule, value, callback) => {
      if (value > 4) {
        return callback(
          new Error()
        )
      } else {
        callback()
      }
    },

    checkPointExceedUsable: (rule, value, callback, exceed) => {
      if (value > exceed) {
        return callback(
          new Error()
        )
      } else {
        callback()
      }
    }
  }
  inject('antdvalidate', antdvalidate)
}
