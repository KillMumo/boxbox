import React from 'react'
import Layout from './Layout'
import renderField from './renderField'

/**
 * @param {表单配置} configs
 * @param {form实例} options.form
 * @param {初始值 object} options.initialValue
 */
const renderForm = (configs = [], options = {}) => {
  const { form, initialValue = {}, needWrap } = options

  return configs.map((c) => {
    const i = { initialValue: initialValue[c.name], ...c }
    const isHidden = calculateHidden(c.hidden)
    if (isHidden) return null

    if (Array.isArray(i.children)) {
      return (
        <Layout key={i.id || i.name} config={i}>
          {renderForm(i.children, { form, initialValue, needWrap: true })}
        </Layout>
      )
    }
    return (
      <Layout key={i.id || i.name} config={i}>
        {renderField({ form, config: i, needWrap })}
      </Layout>
    )
  })
}

export default renderForm

// 计算出是否隐藏
function calculateHidden(config) {
  const type = typeof config
  if (type === 'function') {
    return config()
  }

  if (type === 'boolean') return config

  return !!config
}
