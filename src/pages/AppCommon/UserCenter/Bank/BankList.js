import React, { useMemo, useCallback } from 'react'
import { Form, Button, message } from 'antd'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { getAllBankList, modifyBankNo } from '@/services/bank'
import { saveState } from '@/common/store'
import router from 'umi/router'
import { useTable } from '@dragon/hooks'

const BankList = (props) => {
  // 列表查询
  const { refresh: refreshList, tableProps } = useTable(getAllBankList)

  // 表格列
  const columns = useMemo(() => {
    //设为默认 按钮事件
    const check = (id) => {
      console.log('设为默认')
      modifyBankNo(id).then((res) => {
        if (res instanceof Error) return
        message.success('设置成功')
        refreshList()
      })
    }

    return [
      {
        title: '账户名',
        dataIndex: 'accountName',
        align: 'center',
        width: 100
      },
      {
        title: '银行账号',
        dataIndex: 'bankNumber',
        align: 'center',
        width: 140
      },
      {
        title: '账户类型',
        dataIndex: 'accountType',
        align: 'center',
        width: 110
      },
      {
        title: '状态',
        dataIndex: 'accountState',
        align: 'center',
        width: 55
      },
      {
        title: '开户银行',
        dataIndex: 'bankSiteName',
        align: 'center',
        width: 110
      },
      {
        title: '所属支行',
        dataIndex: 'bankBranch',
        align: 'center',
        width: 150
      },
      {
        title: '开户省份',
        dataIndex: 'bankProvince',
        align: 'center',
        width: 80,
        render: (text) => <span>{text || '无'}</span>
      },
      {
        title: '开户城市',
        dataIndex: 'bankCity',
        align: 'center',
        width: 80,
        render: (text) => <span>{text || '无'}</span>
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 100,
        render: (t, r) => (
          <ButtonGroup type="action">
            {r.isDefault === 1 ? (
              <Button disabled>已默认</Button>
            ) : (
              <Button
                onClick={() => {
                  check(r.id)
                }}
              >
                设为默认
              </Button>
            )}
          </ButtonGroup>
        )
      }
    ]
  }, [refreshList])

  // 左侧按钮组
  const renderButtonGroup = useCallback(() => {
    const { dataSource } = tableProps

    const handleAdd = () => {
      saveState(dataSource[0].accountName, 'accountName')
      router.push('/userCenter/bank/add')
    }

    //导出excel
    const handleExportToExcel = () => {
      console.log('测试导出excel')
    }

    return (
      <ButtonGroup>
        <Button type="primary" onClick={handleAdd}>
          添加银行账户
        </Button>
        <Button auth="bank_export" onClick={handleExportToExcel}>
          导出Excel
        </Button>
      </ButtonGroup>
    )
  }, [tableProps])

  return (
    <Card>
      {renderButtonGroup()}
      <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default Form.create()(BankList)
