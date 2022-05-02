import React, { useCallback } from 'react'
import { Modal } from 'antd'

// afterValidate校验之后的方法
// form: props.form
// children: 一个Form组件
const ModalForm = ({ afterValidate, children, form, bodystyle, ...props }) => {
  const { validateFieldsAndScroll } = form

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          afterValidate(values, props.onCancel)
        }
      })
    },
    [afterValidate, props.onCancel, validateFieldsAndScroll]
  )

  return (
    <Modal
      onOk={onSubmit}
      destroyOnClose
      {...props}
      bodyStyle={bodystyle || { maxHeight: 640, overflow: 'scroll' }}
    >
      {React.cloneElement(children, { onSubmit })}
    </Modal>
  )
}

export default ModalForm
