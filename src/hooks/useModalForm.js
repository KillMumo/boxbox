import { useState, useCallback } from 'react'

const useModalForm = (defaultProps, asyncFunc) => {
  const [visible, toggleVisible] = useState(false)

  const onCancel = useCallback(() => {
    toggleVisible(false)
  }, [])

  const open = useCallback(() => {
    toggleVisible(true)
  }, [])

  return {
    open,
    props: {
      ...defaultProps,
      visible,
      onCancel
    }
  }
}

export default useModalForm
