import React from 'react'
import Result from '@/components/Result'
import Link from 'umi/link'
import { Button } from 'antd'
import { ButtonGroup } from '@/components/ButtonGroup'

const Step3 = (props) => {
  const {
    location: { pathname }
  } = props
  const isUpdate = pathname.indexOf('update') !== -1

  return (
    <Result type="success" desc={isUpdate ? '修改成功' : '注册成功'}>
      <ButtonGroup align="center">
        <Button type="primary">
          <Link to="/auth/upload">上传认证材料</Link>
        </Button>
      </ButtonGroup>
    </Result>
  )
}

export default Step3
