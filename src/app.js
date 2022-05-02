import React from 'react'
import './global.less'
import { configRules } from '@dragon/form'

configRules(
  (() => {
    const typeMap = {
      select: '选择',
      file: '上传',
      input: '输入'
    }
    return (condition, label) => {
      let rules = []
      const {
        name: fieldName,
        required,
        regex,
        length,
        boundary,
        whitespace = true,
        type = 'input'
      } = condition

      const name = fieldName || label

      if (required) {
        rules.push({ required: true, message: `请${typeMap[type]}${name}` })
      }

      if (whitespace) {
        rules.push({ whitespace, message: `请${typeMap[type]}${name}` })
      }

      // 取消whitespace
      if (['select', 'file'].includes(type)) {
        rules = rules.filter((i) => !i.whitespace)
      }

      if (regex) {
        rules.push({ pattern: regex.regex, message: regex.msg || `请输入正确的${name}` })
      }
      if (length) {
        rules.push({
          max: length.max,
          min: length.min,
          message: length.msg || `请输入正确的${name}`
        })
      }

      if (boundary) {
        rules.push({
          transform: (v) => v && +v,
          min: boundary.min,
          max: boundary.max,
          type: 'number',
          message: boundary.msg || `请输入正确的${name}`
        })
      }

      if (type === 'file') {
        rules.push({
          validator: (rule, value, callback) => {
            if (value?.some((i) => i.status === 'uploading')) {
              callback('文件正在上传中')
            } else {
              callback()
            }
          }
        })
      }

      return rules
    }
  })()
)

// 平台切换时，路由带上域名，把新的token存入localStorage
const search = window.location.search
const prefix = search.split('=')[0].split('?')[1]
const token = search.split('=')[1]
if (prefix === 'token' && token) {
  localStorage.setItem('token_key', JSON.stringify(token))
}

require('@/utils/iconfont')

export const dva = {
  config: {
    onReducer: (reducer) => {
      return (state, action) => {
        const newState = reducer(state, action)
        if (action.type === 'USER_LOGOUT' && !action.payload) {
          return reducer({}, action)
        }
        return newState
      }
    },
    onError(err) {
      err.preventDefault()
      console.error(err.message)
    }
  }
}

export function rootContainer(container) {
  const EnhanceContainer = require('@/pages/Enhance').default
  return React.createElement(EnhanceContainer, null, container)
}
