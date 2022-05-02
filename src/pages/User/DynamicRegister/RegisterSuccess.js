import React from 'react'
import Result from '@/components/Result'
import Link from 'umi/link'
import { Button, Icon } from 'antd'
import GlobalHeader from '@/components/GlobalHeader'
import styles from './styles.less'
import { useSelector } from 'react-redux'
import { authMap } from '@/common/map'
import ButtonGroup from '@/components/ButtonGroup'

const Page = (props) => {
  // redux数据
  const { pageConfig } = useSelector(({ pageConfig }) => ({
    pageConfig
  }))

  return (
    <React.Fragment>
      <div className={styles.title}>企业注册</div>
      <GlobalHeader
        left="注册"
        right={
          <Link to={'/user/login'}>
            我已注册，马上登陆
            <Icon type="right" />
          </Link>
        }
      />
      <div className={styles.container}>
        <Result
          type="success"
          title="注册成功"
          desc={'请提交认证材料并等待审核，认证审核通过前暂时无法使用平台功能'}
        >
          <ButtonGroup align="center">
            <Button type="primary">
              <Link to="/auth/upload">去认证</Link>
            </Button>
          </ButtonGroup>
        </Result>
      </div>
    </React.Fragment>
  )
}

export default Page
