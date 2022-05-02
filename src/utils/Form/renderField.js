import React from 'react'
import { Form } from 'antd'
import fieldValidator from '../fieldValidator'

/**
 * @param {antd form} form
 * @param {object} config
 */
const Field = (props) => {
  const {
    form: { getFieldDecorator },
    config,
    needWrap
  } = props

  const Container = needWrap ? Form.Item : React.Fragment

  const { name, children, initialValue, ...restConfig } = config

  // 校验规则
  const { rules = [], condition } = restConfig
  const validateRules = condition
    ? rules.concat({
        validator: fieldValidator,
        ...condition
      })
    : rules

  return (
    <Container>
      {name
        ? getFieldDecorator(name, {
            validateTrigger: 'onBlur',
            ...restConfig,
            initialValue: typeof initialValue === 'number' ? initialValue : initialValue || void 0,
            rules: validateRules
          })(children)
        : children}
    </Container>
  )
}

export default Field
