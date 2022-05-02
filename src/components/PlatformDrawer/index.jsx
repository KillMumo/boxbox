import React, { useMemo, useState } from 'react'
import {
  Drawer,
  Button,
  List,
  Popconfirm,
  Modal,
  Row,
  Col,
  Form as AntdForm,
  Input,
  Table,
  Icon,
  message,
  Tooltip
} from 'antd'
import styles from './styles.less'
import { useBool, useRequest } from '@dragon/hooks'
import { Form, ConfigForm } from '@dragon/form'
import { getTpList, changeTp, tpDetail, addTp, deleteTp } from '@/services/microSubsidy/platform'
import ButtonGroup from '../ButtonGroup'
import usePermission from '@/hooks/usePermission'

//添加平台搜索框配置
const config = [
  {
    itemProps: { label: '平台邀请码' },
    name: 'inviteCode', // 字段名
    children: <Input placeholder="请输入" />
  }
]

//搜索框样式
const searchFormConfig = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
  condition: { whitespace: false },
  colon: false
}

const Platform = (props) => {
  const { visible, open, close } = props
  //是否有删除的权限
  const hasDeleteAuth = usePermission('平台管理-删除平台')
  //表格为空展示的文字
  const [emptyText, setEmptyText] = useState('暂无数据')
  //添加平台弹框的visible
  const [modalVisible, { setTrue: openModal, setFalse: closeModal }] = useBool()
  // 当前页面的路由
  const path = useMemo(() => {
    return window.location.pathname
  }, [])
  // 当前页面的端口号
  const port = useMemo(() => {
    return window.location.port
  }, [])

  // 获取平台列表
  const { data: tpList = [], start: getListReq } = useRequest(getTpList)
  // 获取平台详情
  const { data: detail = {}, start: fetchDetailReq, setData } = useRequest(tpDetail, {
    manual: true,
    onSuccess: (res) => {
      if (res === null) {
        setEmptyText('很抱歉，未查询到相关平台，请核对邀请码是否输入有误')
      }
    }
  })

  // 平台切换
  const { start: changeReq } = useRequest(changeTp, {
    manual: true,
    onSuccess: (res) => {
      const { domain, token } = res
      window.location.href = `http://${domain}:${port}?token=${token}`
    }
  })
  // 添加平台
  const { start: addTpReq } = useRequest(addTp, {
    manual: true,
    onSuccess: (res) => {
      message.success('添加成功')
      closeModal()
      setData && setData(null)
      setEmptyText('暂无数据')
      getListReq()
    }
  })
  // 删除平台
  const { start: deleteReq } = useRequest(deleteTp, {
    manual: true,
    onSuccess: (res) => {
      message.success('平台删除成功')
      getListReq()
    }
  })

  //搜索提交
  const handleSearch = (e) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        fetchDetailReq(values)
      }
    })
  }

  // 表头
  const columns = useMemo(() => {
    return [
      {
        title: '平台名称',
        dataIndex: 'name',
        render: (t, r) => (
          <div className={styles.tableData}>
            <img width="40px" src={r.icon} alt="" />
            {r.status === null && (
              <Button
                style={{ color: 'rgba(0,0,0,0.85)' }}
                type="link"
                onClick={() => addTpReq({ inviteCode: r.inviteCode })}
              >
                {r.tpName}
              </Button>
            )}
            {r.status !== null && (
              <div className={styles.disableText}>
                <Button type="link" disabled>
                  {r.tpName}
                </Button>
                <div className={styles.tip}>该平台已添加</div>
              </div>
            )}
          </div>
        )
      }
    ]
  }, [addTpReq])

  return (
    <Drawer
      title="相关平台"
      width={300}
      mask={false}
      onClose={close}
      visible={visible}
      placement="right"
      getContainer={false}
      className={styles.drawer}
    >
      <Modal
        title="添加平台"
        visible={modalVisible}
        maskClosable={false}
        footer={null}
        onCancel={() => {
          closeModal()
          setData && setData(null)
          setEmptyText('暂无数据')
        }}
        destroyOnClose={true}
      >
        <Form form={props.form} {...searchFormConfig} onSubmit={handleSearch}>
          <Row gutter={24}>
            <Col span={16}>
              <ConfigForm config={config} />
            </Col>
            <Col span={8}>
              <AntdForm.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </AntdForm.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ marginBottom: 66 }}>
          <Table
            columns={columns}
            locale={{ emptyText: emptyText }}
            dataSource={toArray(detail)}
            pagination={false}
          />
        </div>
      </Modal>
      <List
        className={styles.list}
        dataSource={tpList}
        renderItem={(item) => (
          <List.Item
            key={item.tpId}
            actions={[
              <Popconfirm
                title="你确定删除该平台吗?"
                onConfirm={() => deleteReq({ inviteCode: item.inviteCode })}
                onCancel={() => {}}
                okText="确定"
                cancelText="取消"
                placement="bottom"
              >
                {item.status === 2 && hasDeleteAuth && (
                  <Icon type="delete" key={`a-${item.tpId}`} />
                )}
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={<img width="32px" src={item.icon} alt="" />}
              title={
                <a onClick={() => changeReq({ inviteCode: item.inviteCode })}>{item.tpName}</a>
              }
            />
          </List.Item>
        )}
      />
      <div className={styles.bottom}>
        <ButtonGroup align="center">
          <Button
            className={styles.button}
            onClick={close}
            type="primary"
            onClick={() => openModal()}
            auth="平台管理-添加平台"
          >
            添加平台
          </Button>
        </ButtonGroup>
      </div>
    </Drawer>
  )
}

export default Form.create()(Platform)

function toArray(obj) {
  let arr = []
  if (obj === null || Object.keys(obj).length === 0) {
    return null
  } else {
    arr.push(obj)
    return arr
  }
}
