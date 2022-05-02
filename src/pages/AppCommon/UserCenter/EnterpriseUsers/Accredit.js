import React, { useCallback, useState, useMemo } from 'react'
import { Row, Icon, Button } from 'antd'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import styles from './styles.less'
import { Link } from 'react-router-dom'

import data from './data'

const Description = DescriptionList.Description

//tab列表
const tabList = [
  {
    key: '1',
    tab: '管理员'
  },
  {
    key: '2',
    tab: '操作员'
  },
  {
    key: '3',
    tab: '复核员'
  }
]

//当前用户的角色列表，hasPos为true则为拥有该角色权限
const positionList = [
  {
    cmyCode: '0B23132C9334099E4E9296577F22AA07',
    hasPos: true,
    posCode: '1',
    posName: '管理员',
    userId: '211b61df068b411ca89ef4266b26d9648ea5a63b'
  },
  {
    cmyCode: '0B23132C9334099E4E9296577F22AA07',
    hasPos: true,
    posCode: '2',
    posName: '操作员',
    userId: '211b61df068b411ca89ef4266b26d9648ea5a63b'
  },
  {
    cmyCode: '0B23132C9334099E4E9296577F22AA07',
    hasPos: false,
    posCode: '3',
    posName: '复核员',
    userId: '211b61df068b411ca89ef4266b26d9648ea5a63b'
  }
]

//用户详情
const detail = {
  userRealName: 'test',
  userPhone: '123456',
  cmyName: '核心企业',
  userStatusDesc: '有效',
  posNameSet: ['管理员', '操作员']
}

const Accredit = () => {
  // 选中的tabKey
  const [key, setKey] = useState('1')
  //tab切换
  const handleTabChange = useCallback((key) => {
    setKey(key)
  }, [])

  // 选中的row
  const [selectedRows, setSelectedRows] = useState([])

  //点击三个角色按钮事件
  const buttonClick = useCallback(() => {
    console.log('测试按钮点击')
  }, [])

  //渲染权限表格
  const renderTable = useCallback(
    (dataSet) => {
      //查找当前资源表是否有操作权限
      const positionIndex = positionList.findIndex((value) => {
        return value.posCode === key
      })

      // 获取选中的key
      const getSelectedRowKeys = (records) => {
        return records.reduce((result, item) => {
          result.push(item.code)
          return result.concat(item.children ? getSelectedRowKeys(item.children) : '')
        }, [])
      }

      //表格选择事件
      const rowSelection = {
        // 默认勾选的row
        selectedRowKeys: selectedRows,
        // 如果没有某个角色的授权，则table中的资源都不可点击，置为灰色
        getCheckboxProps: () => ({
          disabled: positionList.length !== 0 ? !positionList[positionIndex].hasPos : false
        }),
        // 选择框回调
        onSelect: (record, selected) => {
          const newSelectedKeys = getSelectedRowKeys([record]).filter((i) => i)
          if (selected) {
            setSelectedRows((rows) => [...rows, ...newSelectedKeys])
          } else {
            setSelectedRows((rows) => rows.filter((i) => !newSelectedKeys.includes(i)))
          }
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          setSelectedRows(selectedRows.map((i) => i.code))
        }
      }

      //表头
      const columns = [
        {
          title: '资源',
          dataIndex: 'name',
          key: 'name',
          width: '73%'
          /*render: (t, r) => {
          return renderExpandedRow(t, r)
        }*/
        },
        {
          title: '资源类型',
          dataIndex: 'level',
          key: 'level',
          render: (t) => <span>{t === 0 ? '菜单' : t === 1 ? 'url' : '请求'}</span>
        }
      ]

      return (
        <React.Fragment>
          <PagingTable
            rowKey={(record) => record.code}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={dataSet}
          />
        </React.Fragment>
      )
    },
    [key, selectedRows]
  )

  //渲染不同的tab
  const tabs = useMemo(
    () => ({
      '1': () => renderTable(data),
      '2': () => renderTable([]),
      '3': () => renderTable([])
    }),
    [renderTable]
  )

  //保存按钮事件
  const save = useCallback(() => {
    console.log('测试提交')
  }, [])

  return (
    <Card transparent>
      <Card>
        <DescriptionList border={false}>
          <Description label="用户姓名">{detail.userRealName}</Description>
          <Description label="手机号">{detail.userPhone}</Description>
          <Description label="所属企业">{detail.cmyName}</Description>
          <Description label="状态">{detail.userStatusDesc}</Description>
          <Description label="当前角色">{detail.posNameSet.join(',')}</Description>
        </DescriptionList>
      </Card>
      <Card title="角色授权">
        <Row>
          {positionList.map((item) => (
            <Button
              key={item.posName}
              className={`${styles.button} ${item.hasPos ? styles.selected : null}`}
              onClick={() => {
                buttonClick(item.posCode, !item.hasPos)
              }}
            >
              {item.posName}
            </Button>
          ))}
          <Icon type="exclamation-circle" className={styles.warningIcon} />
          <span className={styles.warningMsg}>系统默认角色功能，用户可以选择后自行修改</span>
        </Row>
      </Card>
      <Card
        title="拥有资源"
        tabList={tabList}
        onTabChange={handleTabChange}
        defaultActiveTabKey="1"
      >
        {tabs[key]()}
        <ButtonGroup align="center">
          <Button
            type="primary"
            onClick={() => {
              save()
            }}
          >
            保存
          </Button>
          <Button>
            <Link to={`/userCenter/enterpriseUsers`}>返回</Link>
          </Button>
        </ButtonGroup>
      </Card>
    </Card>
  )
}

export default Accredit
