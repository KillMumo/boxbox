import React from 'react'
import { Spin, Button, Alert, Divider, Row, Col } from 'antd'
import styles from './styles.less'
import { useRequest } from '@dragon/hooks'
import { fetchAuthInfo } from '@/services/register'
import router from 'umi/router'
import Result from '@/components/Result'
import ButtonGroup from '@/components/ButtonGroup'

const textsMap = {
  '4': {
    // 退回
    type: 'return',
    img: require('@/assets/auth/退回.png'),
    title: '审核退回',
    desc: '抱歉，您的认证资料审核退回，需修改后重新提交申请。',
    tips: {
      header: '退回理由：'
    }
  },
  '5': {
    // 驳回
    type: 'error',
    img: require('@/assets/auth/驳回.png'),
    title: '审核驳回',
    desc: '抱歉，您的认证资料审核驳回，感谢您对我们的关注和支持。',
    tips: {
      header: '驳回理由：'
    }
  },
  '3': {
    // 待审核
    type: 'waiting',
    img: require('@/assets/auth/waiting.png'),
    title: '等待审核',
    desc: '您已成功提交企业认证材料，请等待平台审核，审核通过后即可使用平台其他功能'
    // tips: {
    //   header: '温馨提示：',
    //   body:
    //     '尊敬的用户，稍后将由专人与您联系，沟通认证材料线下寄送事宜。请您耐心等待，此外，平台方将于1-2个工作日审核您的注册认证信息，谢谢您的配合。'
    // }
  }
}

const Auth = () => {
  const { loading, data: res = {} } = useRequest(fetchAuthInfo, {
    onSuccess: (r) => {
      const { status } = r
      if (status === 1) {
        router.replace('/home')
        return
      }
      // if (status === 5) {
      //   router.replace(`/user/${inviteCode}/login`)
      //   return
      // }
    }
  })

  const data = {
    ...textsMap[res.status],
    ...res
  }

  return (
    <Spin spinning={loading}>
      <div className={styles.pageTitle}>提交认证材料</div>
      <div className={styles.container}>
        <Result type={data?.type} title={data?.title} desc={data?.desc}>
          {[4, 5].includes(data.status) && (
            <div className={styles.alert}>
              <Alert
                message={data?.tips?.header}
                description={data.status === 4 ? data.returnReason : data.refusedReason}
                type="error"
              />
            </div>
          )}
          {res.status === 4 && (
            <ButtonGroup align="center">
              <Button type="primary" onClick={() => router.replace('/auth/edit')}>
                修改认证材料
              </Button>
            </ButtonGroup>
          )}
        </Result>
        <Divider type="horizontal" />
        <Row>
          <Col span={4} className={styles.subTitle}>
            认证信息
          </Col>
          <Col span={20} className={styles.colMargin}>
            <span>管理员姓名</span>
            {data.adminName}
          </Col>
          <Col span={4} />
          <Col span={20} className={styles.colMargin}>
            <span>管理员手机号</span>
            {data.adminPhone}
          </Col>
          <Col span={4} />
          <Col span={20} className={styles.colMargin}>
            <span>提交时间</span>
            {data.createTime}
          </Col>
        </Row>
      </div>
    </Spin>
    // <h3 className={styles.title}>企业认证</h3>
    // <div className={styles.resultContainer}>
    //   <Row>
    //     <Col span={4}>
    //       <img src={data.img} alt="" />
    //     </Col>
    //     <Col span={19} offset={1}>
    //       <div className={styles.subtitle}>{data.subTitle}</div>
    //       <div className={styles.tips}>
    //         {data.tips?.header}
    //         <br />
    //         {data.tips?.body || data.returnReason || data.refuseReason}
    //       </div>
    //       {res.status === 4 && (
    //         <Button type="primary" onClick={() => router.replace('/auth/edit')}>
    //           修改认证材料
    //         </Button>
    //       )}
    //     </Col>
    //   </Row>
    // </div>
  )
}

export default Auth
