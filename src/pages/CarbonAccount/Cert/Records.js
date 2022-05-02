import React, { useMemo } from 'react'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { formatTime } from '@/utils'
import { Form, Input, Row, Col, Button, Select, Tag, Popconfirm, message } from 'antd'
import { searchFormLayout } from '@/common/config'
import { Link } from 'react-router-dom'
import { useTable } from '@dragon/hooks'
import { fetchDeviceList } from '@/services/carbon/device'
import PagingTable from '@/components/PagingTable'
import { fetchList } from '@/services/carbonAccount/cert'
import moment from 'moment'

const List = (props) => {
  const {
    form: { getFieldDecorator, resetFields }
  } = props

  const { searchBy, submit, tableProps } = useTable(fetchList, {
    form: props.form
  })


  const formatTime= val =>{
    console.log(val)
    return val?moment(val[0]).format('YYYY-MM-DD')+'-'+moment(val[1]).format('YYYY-MM-DD'):''
  }

  //表头
  const   columns = useMemo(() => {
    return [
      {
        title: '证明编号',
        dataIndex: 'jsonExtra.certNo',
        width: 180
      },
      {
        title: '证明类型',
        dataIndex: 'jsonExtra.certType',
        width: 120
      },
      {
        title: '碳汇名称',
        dataIndex: 'jsonExtra.sinkName',
        width: 120,
        ellipsis: true
      },
      {
        title: '核算周期',
        dataIndex: 'jsonExtra.certCycle',
        width: 120,
        // render: formatTime
      },
      {
        title: '核证日期',
        dataIndex: 'createTime',
        width: 120,
        // render: (t) => formatTime(t)
      },

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
      <Card>
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
