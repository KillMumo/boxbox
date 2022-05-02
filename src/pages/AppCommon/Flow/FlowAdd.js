import React, { useMemo, useCallback, useEffect } from 'react'
import { Form, Row, Col, Input, Button, message, Select } from 'antd'
import { Link } from 'react-router-dom'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { addFlow, getFlowDetail, updateFlow, fetchTenant } from '@/services/flow'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'

const { TextArea } = Input

const FlowAdd = (props) => {
  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator, validateFieldsAndScroll }
  } = props

  //上传文件
  //const [flowFilePath, setFlowFilePath] = useState(null)

  //流程详情
  const { loading: getDetailLoading, data: info = {}, start } = useRequest(
    (id) => getFlowDetail(id),
    {
      manual: true
    }
  )

  //租户列表
  const { data: tenantList = [] } = useRequest(fetchTenant)

  //更新流程
  const { loading: updateFlowLoading, start: updateFlowReq } = useRequest(updateFlow, {
    manual: true
  })
  //新增流程
  const { loading: addFlowLoading, start: addFlowReq } = useRequest(addFlow, {
    manual: true
  })

  useEffect(() => {
    if (id) {
      start(id)
    }
  }, [id, start])

  const formLayout = useMemo(
    () => ({
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }),
    []
  )

  const formItemLayout = useMemo(
    () => ({
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    }),
    []
  )

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          const action = id ? updateFlowReq : addFlowReq
          action({
            id,
            ...values
          }).then((res) => {
            if (res instanceof Error) return
            message.success(`${id ? '更新' : '添加'}成功`)
            router.push('/flow')
          })
        }
      })
    },
    [id, validateFieldsAndScroll, updateFlowReq, addFlowReq]
  )

  // const uploadProp = useMemo(
  //   () => ({
  //     action: '/matrix/file/upload',
  //     headers: {
  //       Authorization: fetchToken()
  //     }
  //   }),
  //   []
  // )

  // const handleChange = useCallback((inform) => {
  //   if (inform.file.status === 'uploading') {
  //     return
  //   }
  //   if (inform.file.status === 'done') {
  //     setFlowFilePath(inform.file.name)
  //   } else if (inform.file.status === 'error') {
  //     message.error(`${inform.file.name} 上传失败！.`)
  //   }
  // }, [])

  return (
    <Card title="基本信息" loading={getDetailLoading}>
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="流程key">
              {getFieldDecorator('flowKey', {
                initialValue: info.flowKey,
                rules: [
                  {
                    required: true,
                    message: '请输入流程key'
                  }
                ]
              })(<Input placeholder="请输入流程key" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="流程名称">
              {getFieldDecorator('flowName', {
                initialValue: info.flowName,
                rules: [
                  {
                    required: true,
                    message: '请输入流程名称'
                  }
                ]
              })(<Input placeholder="请输入流程名称" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="流程别名">
              {getFieldDecorator('flowAlias', {
                initialValue: info.flowAlias,
                rules: [
                  {
                    required: true,
                    message: '请输入流程别名'
                  }
                ]
              })(<Input placeholder="请输入流程别名" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="流程类型">
              {getFieldDecorator('flowType', {
                initialValue: info.flowType,
                rules: [
                  {
                    required: true,
                    message: '请输入流程类型'
                  }
                ]
              })(<Input placeholder="请输入流程类型" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="流程图片">
              {getFieldDecorator('flowImage', {
                initialValue: info.flowImage,
                rules: [
                  {
                    required: true,
                    message: '请输入流程图片url'
                  }
                ]
              })(<Input placeholder="请输入流程图片url" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="流程文件路径">
              {getFieldDecorator('flowFilePath', {
                initialValue: info.flowFilePath
                /*valuePropName: 'flowFilePath',
                rules: [
                  {
                    required: true,
                    message: '请输入流程文件路径'
                  }
                ]*/
              })(<Input placeholder="请输入流程文件路径" />)
              /*(
                <Upload
                  name="file"
                  showUploadList={false}
                  // beforeUpload={this.beforeUpload}
                  onChange={handleChange}
                  {...uploadProp}
                >
                  {flowFilePath ? (
                    <Button> {flowFilePath}</Button>
                  ) : (
                    <Button>
                      <Icon type="upload" /> 上传文件
                    </Button>
                  )}
                </Upload>

              )*/
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="租户">
              {getFieldDecorator('tenantId', {
                initialValue: info.tenantId,
                rules: [
                  {
                    required: true,
                    message: '请选择租户'
                  }
                ]
              })(
                <Select placeholder="请选择租户">
                  {tenantList.map((t) => (
                    <Select.Option key={t.tenantId} value={t.tenantId}>
                      {t.tenantName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item {...formItemLayout} label="流程内容">
              {getFieldDecorator('flowContent', {
                initialValue: info.flowContent
              })(<TextArea rows={4} placeholder="请输入流程内容" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <ButtonGroup align="center">
              <Button
                loading={updateFlowLoading || addFlowLoading}
                type="primary"
                htmlType="submit"
              >
                提交
              </Button>
              <Button>
                <Link to="/flow">返回</Link>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default Form.create()(FlowAdd)
