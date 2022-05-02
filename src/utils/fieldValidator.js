class GenerateValidator {
  rulesName = ['required', 'regex', 'length', 'boundary']

  validators = {
    required: (v, cb) => {
      const { required, name } = this.rule
      if (required === true && (!!v === false || v.toString().trim() === '')) {
        cb(`请输入${name}`)
        return false
      }
      return true
    },
    regex: (v, cb) => {
      const { regex, required } = this.rule
      if (!required) {
        if (v === undefined || v === '') {
          return true
        } else {
          if (regex && !regex.regex.test(v || '')) {
            cb(this.getErrorMsg(regex.msg))
            return false
          }
          return true
        }
      } else {
        if (regex && !regex.regex.test(v || '')) {
          cb(this.getErrorMsg(regex.msg))
          return false
        }
        return true
      }
    },
    length: (v, cb) => {
      const { length } = this.rule
      if (length.min && v && v.length < length.min) {
        cb(this.getErrorMsg(length.msg))
        return false
      }
      if (length.max && v && v.length > length.max) {
        cb(this.getErrorMsg(length.msg))
        return false
      }
      return true
    },
    boundary: (v, cb) => {
      // strictlyEqual true 的时候不用写等号
      const {
        boundary,
        boundary: { strictlyEqual: strictInRule }
      } = this.rule
      const { strictlyEqual } = this.options
      const strict = strictInRule === !strictlyEqual ? strictInRule : strictlyEqual

      if (strict) {
        if (typeof boundary.min !== 'undefined' && v < boundary.min) {
          cb(this.getErrorMsg(boundary.msg))
          return false
        }
        if (typeof boundary.max !== 'undefined' && v > boundary.max) {
          cb(this.getErrorMsg(boundary.msg))
          return false
        }
      } else {
        if (typeof boundary.min !== 'undefined' && v <= boundary.min) {
          cb(this.getErrorMsg(boundary.msg))
          return false
        }
        if (typeof boundary.max !== 'undefined' && v >= boundary.max) {
          cb(this.getErrorMsg(boundary.msg))
          return false
        }
      }
      return true
    }
  }

  constructor(options) {
    this.options = options
    return this.generate()
  }

  generate = () => {
    return (rule, value, callback) => {
      this.rule = rule
      const res = this.rulesName.map((item) => {
        const needValidate = !!rule[item]
        if (needValidate) {
          return this.validators[item](value, callback)
        }
        return true
      })
      if (res.every((i) => i === true)) callback()
    }
  }

  getErrorMsg = (customMsg) => {
    const { name } = this.rule
    return customMsg ? customMsg : `请输入正确的${name}`
  }
}

export default new GenerateValidator({
  strictlyEqual: false
})

// 文件上传中判断
export function validateFiles(rule, value, callback) {
  if (value?.some((i) => i.status === 'uploading')) {
    callback('文件正在上传中')
  } else {
    callback()
  }
}

// 合作时长
export function validateMonth(rule, value, cb) {
  if (value < 0) {
    cb('合作时长不能为负数')
  } else if (value > 10000) {
    cb('请输入正确的合作时长')
  } else {
    cb()
  }
}
