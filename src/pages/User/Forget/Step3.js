import React from 'react'
import Result from '@/components/Result'
import Link from 'umi/link'
import { Button } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'

const Step1 = () => {
  return (
    <Result type="success" title="完成修改" desc="密码已修改，您可使用新设置的密码进行登录。">
      <ButtonGroup align="center">
        <Button type="primary">
          <Link to="/user/login">马上登录</Link>
        </Button>
      </ButtonGroup>
    </Result>
  )
}

export default Step1
