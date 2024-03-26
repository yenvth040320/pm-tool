import { create, formatters } from 'jsondiffpatch'

export default function({ app }, inject) {
  const jsonDiff = create({
    objectHash(obj, index) {
      if (typeof obj._id !== 'undefined') {
        return obj._id
      }
      if (typeof obj.id !== 'undefined') {
        return obj.id
      }
      if (typeof obj.name !== 'undefined') {
        return obj.name
      }
      return '$$index:' + index
    },
    arrays: {
      detectMove: true,
      includeValueOnMove: false
    },
    textDiff: {
      minLength: 60
    },
    propertyFilter(name, context) {
      return name.slice(0, 1) !== '$'
    },
    cloneDiffValues: false
  })

  inject('jsonDiff', jsonDiff)
  inject('jsonDiffFormatters', formatters)
}
