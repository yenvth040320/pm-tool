import moment from 'moment'

const MINUTE_PER_HOUR = 60
const MINUTE_WORKING_PER_DAY = 480

export default {
  methods: {
    calculateWorkHours(start, end) {
      const startWork = moment(start).startOf('second')
      const endWork = moment(end).startOf('second')

      const startWorkDefault = moment(startWork).set({ hour: 8, minute: 30, second: 0 })
      // const endWorkDefault = moment(endWork).set({ hour: 17, minute: 30, second: 0 })
      const startLunchTime = moment(endWork).set({ hour: 12, minute: 0, second: 0 })
      const endLunchTime = moment(endWork).set({ hour: 13, minute: 0, second: 0 })

      if (startWork.isBefore(startWorkDefault)) {
        startWork.set(startWorkDefault.toObject())
      }

      if (startWork.isBetween(startLunchTime, endLunchTime)) {
        startWork.set(endLunchTime.toObject())
      }

      if (endWork.isBetween(startLunchTime, endLunchTime)) {
        endWork.set(startLunchTime.toObject())
      }

      // if (endWork.isAfter(endWorkDefault)) {
      //   endWork.set(endWorkDefault.toObject())
      // }

      if (startWork.isSame(endWork)) {
        return 0
      }

      let totalHours = endWork.diff(startWork, 'minutes') / MINUTE_PER_HOUR
      totalHours = Math.round(totalHours * 100) / 100

      if (startWork.isBefore(startLunchTime) && endWork.isAfter(endLunchTime)) {
        totalHours -= 1
      }

      return totalHours
    },

    calculateEndTime(startTime, totalWorkHours) {
      const startWork = moment(startTime).seconds(0)
      const endWorkDefault = moment(startWork).set({ hour: 17, minute: 30, second: 0 })
      // const startWorkDefault = moment(startWork).set({ hour: 8, minute: 30, second: 0 })

      const lunchStart = moment(startWork).set({ hour: 12, minute: 0, second: 0 })
      const lunchEnd = moment(startWork).set({ hour: 13, minute: 0, second: 1 })
      let endWork = moment(startWork).add(totalWorkHours, 'hours')
      if (endWork.isBetween(lunchStart, lunchEnd) || (startWork.isBefore(lunchStart) && endWork.isAfter(lunchEnd))) {
        endWork.add(1, 'hours')
      }
      const timeDifference = endWork.diff(endWorkDefault, 'minutes')
      let diffDay = parseInt(timeDifference / MINUTE_WORKING_PER_DAY)
      let leftMinutes = timeDifference - (diffDay * MINUTE_WORKING_PER_DAY)
      if (leftMinutes === 0) {
        diffDay = diffDay - 1
        leftMinutes = MINUTE_WORKING_PER_DAY
      }
      if (timeDifference > 0) {
        const nextWorkDayStart = moment(endWorkDefault).add({ hours: 15, minutes: 0, seconds: 0 })
        // if select day = FRIDAY => next day = saturday Then change day to next week monday
        if (nextWorkDayStart.days() === 6) {
          nextWorkDayStart.add(2, 'days')
        }
        // if diff day > 1, Add 1 day each loop
        if (diffDay >= 1) {
          for (let i = 1; i <= diffDay; i++) {
            // if loop through friday, add 2 more days
            if (nextWorkDayStart.days() === 5) {
              nextWorkDayStart.add(2, 'days')
            }
            nextWorkDayStart.add(1, 'days')
          }
        }
        endWork = nextWorkDayStart.add(leftMinutes, 'minutes').seconds(0)
      }

      if (timeDifference > 0 && leftMinutes !== 0) {
        const newLunchStart = moment(endWork).set({ hour: 12, minute: 0, second: 0 })
        const newLunchEnd = moment(endWork).set({ hour: 13, minute: 0, second: 1 })
        if (endWork.isBetween(newLunchStart, newLunchEnd) || endWork.isAfter(newLunchEnd)) {
          endWork.add(1, 'hours')
        }
      }

      return endWork.second(0)
    },

    calculateStartTime(endTime, totalWorkHours) {
      const endWork = moment(endTime).seconds(0)
      const startWorkDefault = moment(endWork).set({ hour: 8, minute: 30, second: 0 })

      const lunchStart = moment(endWork).set({ hour: 11, minute: 59, second: 59 })
      const lunchEnd = moment(endWork).set({ hour: 13, minute: 0, second: 0 })
      let startWork = moment(endWork).subtract(totalWorkHours * MINUTE_PER_HOUR, 'minutes')
      if (startWork.isBetween(lunchStart, lunchEnd) || (startWork.isBefore(lunchStart) && endWork.isAfter(lunchEnd))) {
        startWork.subtract(1, 'hours')
      }
      const timeDifference = startWorkDefault.diff(startWork, 'minutes')
      let diffDay = parseInt(timeDifference / MINUTE_WORKING_PER_DAY)
      let leftMinutes = timeDifference - (diffDay * MINUTE_WORKING_PER_DAY)
      if (leftMinutes === 0) {
        diffDay = diffDay - 1
        leftMinutes = MINUTE_WORKING_PER_DAY
      }
      if (timeDifference > 0) {
        const previousDayStart = moment(startWorkDefault).subtract({ hours: 15, minutes: 0, seconds: 0 })
        // if select day = FRIDAY => next day = saturday Then change day to next week monday
        if (previousDayStart.days() === 0) {
          previousDayStart.subtract(2, 'days')
        }
        // if diff day > 1, Add 1 day each loop
        if (diffDay >= 1) {
          for (let i = 1; i <= diffDay; i++) {
            // if loop through friday, add 2 more days
            if (previousDayStart.days() === 1) {
              previousDayStart.subtract(2, 'days')
            }
            previousDayStart.subtract(1, 'days')
          }
        }
        startWork = previousDayStart.subtract(leftMinutes, 'minutes').seconds(0)
      }

      if (timeDifference > 0 && leftMinutes !== 0) {
        const newLunchStart = moment(startWork).set({ hour: 11, minute: 59, second: 59 })
        const newLunchEnd = moment(startWork).set({ hour: 13, minute: 0, second: 0 })
        if (startWork.isBetween(newLunchStart, newLunchEnd) || startWork.isBefore(newLunchStart)) {
          startWork.subtract(1, 'hours')
        }
      }

      return startWork.second(0)
    },

    calculateDuration(start, end) {
      const startDateLunchTimeStart = moment(start).set({ hour: 12, minute: 0, second: 0 })
      const startDateLunchTimeEnd = moment(start).set({ hour: 13, minute: 0, second: 0 })
      const endDateLunchTimeEnd = moment(end).set({ hour: 13, minute: 0, second: 0 })
      let totalDiff = end.diff(start, 'minutes')
      // in 1 day
      if (start.isBefore(startDateLunchTimeStart) && end.isSameOrAfter(startDateLunchTimeEnd)) {
        totalDiff -= 60
      }

      // if > 1 day
      const diffDay = moment(end).startOf('day').diff(moment(start).startOf('day'), 'days')
      if (diffDay > 0) {
        // 15 = 17:30 -> 8:30 next day
        totalDiff -= 60 * 15 * diffDay
        // if through weekend
        if (start.days() + diffDay > 7) {
          totalDiff -= 16 * 60
        }
        // lunch
        totalDiff -= 60 * (diffDay - 1)
        if (end.isSameOrAfter(endDateLunchTimeEnd)) {
          totalDiff -= 60
        }
      }
      totalDiff = Math.round(totalDiff * 100) / 100
      return (totalDiff / 60).toFixed(1)
    }
  }
}
