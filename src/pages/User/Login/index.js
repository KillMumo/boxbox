import React from 'react'
import { Row, Col, Form, Button, Input } from 'antd'
import Link from 'umi/link'
import styles from './index.less'
import useLogin from './hooks/useLogin'
import fieldValidator from '@/utils/fieldValidator'
import IconFont from '@/components/IconFont'
import { useSelector } from 'react-redux'

const Login = (props) => {
  const { form } = props
  const { getFieldDecorator } = form

  // redux数据
  const { pageConfig } = useSelector(({ pageConfig }) => ({
    pageConfig
  }))

  const { graph, fetchGraph, loading, handleLogin } = useLogin(form)

  return (
    <div className={styles.pageWrap}>
      {/* <video
        className={styles.video}
        controls={false}
        autoPlay="autoplay"
        loop
        muted
        src="http://matrix-prod-env.oss-cn-shanghai.aliyuncs.com/0528.mp4?Expires=3061878952&OSSAccessKeyId=LTAI4FuLTur8d4hyP2dPwhL2&Signature=7jUjVEI9OLMQHGDduKYybbHdKxE%3D"
        type="video/mp4"
      ></video> */}
      <div
        className={styles.container}
        style={{
          backgroundImage: 'url("/登陆页bg.jpg")',
          // backgroundImage: 'url(' + `${pageConfig?.backgroundImage}` + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center 0'
        }}
      >
        <div className={styles.logo}>
          <img className={styles.img} src="/logo_登录.png" alt="" />
          {/* <img className={styles.img} src={pageConfig?.icon} alt="" /> */}
          {/* {pageConfig?.name} */}
          包装盒型管理系统
        </div>
        {/* <div className={styles.text}>{pageConfig?.slogan}</div> */}
        <Form onSubmit={handleLogin} hideRequiredMark className={styles.form}>
          <h2>安全登录</h2>
          <Form.Item>
            {getFieldDecorator('account', {
              rules: [
                {
                  required: true,
                  validator: fieldValidator,
                  name: '手机号' // 校验信息的名字
                }
              ]
            })(
              <Input
                prefix={<IconFont className={styles.icon} type="icon-shouji" />}
                size="large"
                placeholder="请输入手机号"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }]
            })(
              <Input
                prefix={<IconFont className={styles.icon} type="icon-password" />}
                size="large"
                type="password"
                placeholder="请输入密码"
              />
            )}
          </Form.Item>
          <Row gutter={18}>
            <Col span={15}>
              <Form.Item>
                {getFieldDecorator('graphCode', {
                  rules: [{ required: true, message: '请输入验证码' }]
                })(
                  <Input
                    prefix={<IconFont className={styles.icon} type="icon-yanzhengma1" />}
                    size="large"
                    placeholder="请输入验证码"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item>
                <img
                  onClick={() => fetchGraph()}
                  className={styles.code}
                  src={graph.graphSource}
                  alt=""
                />
              </Form.Item>
            </Col>
          </Row>
          <Button loading={loading} type="primary" size="large" htmlType="submit" block>
            登 录
          </Button>
          <div className={styles.actionContainer}>
           <Link to="/user/register">企业注册</Link>
          {/*  <Link to="/user/forget">忘记密码</Link>*/}
          </div>
          {/* <div className={styles.loginFooter}>
            <span>电能质量测试及评估区块链云服务平台</span>
          </div> */}
        </Form>
      </div>
    </div>
  )
}

export default Form.create()(Login)
