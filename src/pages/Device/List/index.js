import React, { useMemo } from 'react'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { formatTime } from '@/utils'
import { Form, Input, Row, Col, Button, Select, Tag, Popconfirm, message } from 'antd'
import { searchFormLayout } from '@/common/config'
import { Link } from 'react-router-dom'
import { useTable } from '@dragon/hooks'
import { fetchDeviceList, updateStatus } from '@/services/carbon/device'
import PagingTable from '@/components/PagingTable'

const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields }
  } = props

  const { searchBy, submit, tableProps } = useTable(fetchDeviceList, {
    form: props.form
  })


  //表头
  const columns = useMemo(() => {
    return [
      {
        title: '设备ID',
        dataIndex: 'uid',
        width: 120
      },
      {
        title: '设备名称',
        dataIndex: 'assetName',
        width: 120
      },
      {
        title: '设备类型',
        dataIndex: 'assetType',
        width: 120,
        ellipsis: true
      },
      {
        title: '设备状态',
        dataIndex: 'status',
        width: 120,
        render: (t) =>
          t === '未激活' ? (
            <Tag color="orange">{t}</Tag>
          ) : (
            // ) : t === '已激活' ? (
            //   <Tag color="red">{t}</Tag>
            <Tag color="green">{t}</Tag>
          )
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 120,
        render: (t) => formatTime(t)
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button>
                <Link to={{ pathname: `/device/list/view/${r.uid}` }}>查看</Link>
              </Button>
              {/* {r.status !== '已启用' && (
                <Popconfirm
                  overlayStyle={{ width: 240 }}
                  placement="top"
                  title={`你确定${r.status === '未激活' ? '激活' : '启用'}设备吗?`}
                  onConfirm={() => changeStatus(r.status, r.uid)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link">{r.status === '未激活' ? '激活' : '启用'}</Button>
                </Popconfirm>
              )} */}
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  const renderSearchForm = () => {
    const handleReset = () => {
      searchBy()
      resetFields()
    }

    return (
      <Card style={{ marginTop: 0 }}>
        <Form {...searchFormLayout} onSubmit={submit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="设备ID">
                {getFieldDecorator('uid')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设备名称">
                {getFieldDecorator('assetName')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设备类型">
                {getFieldDecorator('assetType')(
                  <Select placeholder="请选择">
                    <Select.Option key="光伏" value="光伏">
                      光伏
                    </Select.Option>
                    <Select.Option key="风电" value="风电">
                      风电
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="设备状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择">
                    <Select.Option key="未激活" value="未激活">
                      未激活
                    </Select.Option>
                    <Select.Option key="已激活" value="已激活">
                      已激活
                    </Select.Option>
                    {/* <Select.Option key="已启用" value="已启用">
                      已启用
                    </Select.Option> */}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <ButtonGroup type="form" align="left">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  return (
    <Card transparent>
      {renderSearchForm()}
      <Card style={{ marginTop: -10 }}>
        {/* <ButtonGroup>
          <Button to="/assets/add" type="primary">
            添加设备
          </Button>
        </ButtonGroup> */}
        <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
