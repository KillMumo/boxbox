import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, Modal } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import styles from './styles.less'
import PagingTable from '@/components/PagingTable'
import useModalForm from '@/hooks/useModalForm'
import useDict from '@/hooks/useDict'

import {
  getList,
  addDevice,
  updateDevice,
  deleteDevice,
  detailsDevice,
  saveDevice
} from '@/services/carbonAccount/device'
import { useSelector } from 'react-redux'
import { useTable, useRequest } from '@dragon/hooks'
import router from 'umi/router'
import {Link} from "react-router-dom";

const Home = (props) => {
  const {
    form: { getFieldDecorator, resetFields },
    match: {
      params: { type }
    }
  } = props



  const reset = () => {
    router.push(`/device/list`)
    resetFields()
    searchBy()
  }


  const handleDelete = (uids) => {
    Modal.confirm({
      title: '确定删除？',
      content: '删除后不可恢复',
      onOk: () => {
        return deleteDevice(uids).then((res) => {
          if (res instanceof Error) return
          message.success('删除成功')
          refresh()
        })
      }
    })
  }

  const carbonModle = useDict('carbon_modle')


  //查询表单样式设置
  const searchFormLayout = {
    colon: true,
    labelAlign: 'right',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const { refresh, searchBy, submit, tableProps } = useTable(
    getList,
    {
      defaultFilters: { status: type },
      form: props.form
    }
  )

  const role = useSelector(({ user }) => user.role)

  const columns = [
    {
      title: '设备类型',
      dataIndex: 'jsonExtra.deviceType',
      // fixed: 'left',
      width: 200
    },
    {
      title: '设备名称',
      dataIndex: 'jsonExtra.deviceName',
      // fixed: 'left',
      width: 200
    },
    {
      title: '设备ID',
      dataIndex: 'jsonExtra.deviceId',
      width: 200
    },
    {
      title: '描述',
      dataIndex: 'jsonExtra.description',
      width: 200
    },
    {
      title: '能源类型',
      dataIndex: 'jsonExtra.countModel',
      width: 200
    },
    {
      title: '操作时间',
      dataIndex: 'jsonExtra.optTime',
      width: 200
    },
    {
      title: '操作',
      width: 200,
      key: 'action',

      render: (t, r) => {
        return (
          <ButtonGroup type="action">

            <Button>
              <Link to={{ pathname: `/device/view/${r.uid}-${r.jsonExtra.deviceId}` }}>查看</Link>
              {/*<Link to={{ pathname: `/device/waterlist`}}>查看</Link>*/}
            </Button>

            <Button
              auth={"device_update"}
              onClick={() => {
                saveDevice(r);
                router.push(`/device/update`)
              }}
            >
              修改
            </Button>


            <Button auth={"device_update"} onClick={() => handleDelete({ uids: r.uid })}>删除</Button>
          </ButtonGroup>
        )
      }
    }
  ]

  const columns2 = [
    {
      title: '企业名称',
      dataIndex: 'jsonExtra.companyName',
      // fixed: 'left',
      ellipsis: true,
      width: 250
    },
    {
      title: '设备类型',
      dataIndex: 'jsonExtra.deviceType',
      ellipsis: true,
      // fixed: 'left',
      width: 150
    },
    {
      title: '设备名称',
      dataIndex: 'jsonExtra.deviceName',
      ellipsis: true,
      // fixed: 'left',
      width: 150
    },
    {
      title: '设备ID',
      dataIndex: 'jsonExtra.deviceId',
      ellipsis: true,
      width: 150
    },
    {
      title: '描述',
      dataIndex: 'jsonExtra.description',
      ellipsis: true,
      width: 150
    },
    {
      title: '能源类型',
      dataIndex: 'jsonExtra.countModel',
      ellipsis: true,
      width: 150
    },
    {
      title: '操作时间',
      dataIndex: 'jsonExtra.optTime',
      ellipsis: true,
      width: 150
    },
    {
      title: '操作',
      width: 200,
      key: 'action',

      render: (t, r) => {
        return (
          <ButtonGroup type="action">

            <Button>
              <Link to={{ pathname: `/device/view/${r.uid}-${r.jsonExtra.deviceId}` }}>查看</Link>
              {/*<Link to={{ pathname: `/device/waterlist`}}>查看</Link>*/}
            </Button>

            <Button
              auth={"device_update"}
              onClick={() => {
                saveDevice(r);
                router.push(`/device/update`)
              }}
            >
              修改
            </Button>


            <Button auth={"device_delete"} onClick={() => handleDelete({ uids: r.uid })}>删除</Button>
          </ButtonGroup>
        )
      }
    }
  ]

  const SearchForm = () => {
    return (
      <Card style={{ paddingRight: 20 }}>
        <Form {...searchFormLayout} onSubmit={submit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="设备名称">
                {getFieldDecorator('like&deviceName')(<Input placeholder="请输入设备名称" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="能源类型">
                {getFieldDecorator('eq&countModel')(
                  <Select placeholder="请输入">
                    <Select.Option value="" key="">
                      全部
                    </Select.Option>
                    {Object.keys(carbonModle).map((key) => (
                      <Select.Option key={key} value={carbonModle[key]}>
                        {carbonModle[key]}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            {(role!=='account_org')&&(
            <div>
            <Col span={8}>
              <Form.Item label="企业名称">
                {getFieldDecorator('like&companyName')(<Input placeholder="请输入企业名称" />)}
              </Form.Item>
            </Col>
            <Col span={8}></Col>
            <Col span={8}></Col>
            </div>
            )}

            <Col span={8}>
              {/* <Row>
                <Col span={6}></Col>
                <Col span={18}> */}
                  <ButtonGroup align='right'>
                    <Button
                      className={styles.btn}
                      style={{
                        backgroundColor: '#35AE8C',
                        borderColor: '#35AE8C',
                        '&hover': {
                          backgroundColor: '#7ae6c7',
                          borderColor: '#7ae6c7'
                        }
                      }}
                      type="primary"
                      htmlType="submit"
                    >
                      查询
                    </Button>
                    <Button onClick={reset}>重置</Button>
                  </ButtonGroup>
                {/* </Col>
              </Row> */}
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  return (
    <Card transparent>
      <Card style={{ marginTop: 0 }}>
        {SearchForm()}
        <ButtonGroup>
          <Button type="primary" auth={"device_add"}>
            <Link  to={{ pathname: `/device/add` }} >新增</Link>
          </Button>
        </ButtonGroup>
        {(role!=='account_org')&&(<PagingTable rowKey={(i) => i.id} columns={columns2} {...tableProps} />)}
        {(role==='account_org')&&(<PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />)}
      </Card>
    </Card>
  )
}

export default Form.create()(Home)
