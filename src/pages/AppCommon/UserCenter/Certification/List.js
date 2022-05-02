import React from 'react'
import { Row, Col } from 'antd'
import { getSelfCheckInfo } from '@/services/common'
import Card from '@/components/Card'
import Upload from '@/components/Upload'
import styles from './styles.less'
import { useRequest } from '@dragon/hooks'
import { format } from '@/utils'

const List = () => {
  // 获取证件材料信息
  const { loading: getDetailLoading, data = {} } = useRequest(getSelfCheckInfo)
  // 格式化
  const certifications = format(data.urls)

  return (
    <Card loading={getDetailLoading}>
      <Row className={styles.uploadContainer} gutter={24}>
        <Col className={styles.uploadLabel} span={5}>
          营业执照复印件或统一社会信用代码复印件
        </Col>
        <Col span={18}>
          <Upload value={certifications[1]} showOnly />
        </Col>
      </Row>
      <Row className={styles.uploadContainer} gutter={24}>
        <Col className={styles.uploadLabel} span={5}>
          法人身份证复印件
        </Col>
        <Col span={18}>
          <Upload value={certifications[0]} showOnly />
        </Col>
      </Row>
      <Row className={styles.uploadContainer} gutter={24}>
        <Col className={styles.uploadLabel} span={5}>
          管理员身份证复印件
        </Col>
        <Col span={18}>
          <Upload value={certifications[2]} showOnly />
        </Col>
      </Row>
      <Row className={styles.uploadContainer} gutter={24}>
        <Col className={styles.uploadLabel} span={5}>
          授权委托书
        </Col>
        <Col span={18}>
          <Upload value={certifications[3]} showOnly />
        </Col>
      </Row>
      <Row className={styles.uploadContainer} gutter={24}>
        <Col className={styles.uploadLabel} span={5}>
          银行账户证明
        </Col>
        <Col span={18}>
          <Upload value={certifications[4]} showOnly />
        </Col>
      </Row>
    </Card>
  )
}

export default List
