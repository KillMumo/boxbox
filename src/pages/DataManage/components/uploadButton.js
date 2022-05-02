import React from 'react'
import { Button } from 'antd'

const UploadButton = () => {
  return (
    <Button
      icon="plus"
      size="large"
      style={{
        color: 'rgba(216, 216, 216, 1)',
        backgroundColor: 'rgba(251,251,251,1)',
        fontSize: 24,
        width: 50,
        height: 50
      }}
    ></Button>
  )
}

export default UploadButton
