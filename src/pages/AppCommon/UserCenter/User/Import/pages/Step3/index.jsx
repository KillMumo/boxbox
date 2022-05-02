import React from 'react'
import Result from '@/components/Result'
import { Button } from 'antd'
import router from 'umi/router'
import ButtonGroup from '@/components/ButtonGroup'

const Step3 = () => {
  return (
    <Result type="success" title="导入成功">
      <ButtonGroup align="center">
        <Button type="primary" onClick={() => router.push('/userCenter/user')}>
          查看列表
        </Button>
      </ButtonGroup>
    </Result>
  )
}

export default Step3
