import React, { useMemo } from 'react'
import Card from '@/components/Card'
import { useTable } from '@dragon/hooks'
import { fetchTodoList } from '@/services/instance'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { Button } from 'antd'
import { EventStatus } from '@/common/map'

const List = () => {
  const { tableProps } = useTable(fetchTodoList)

  const columns = useMemo(() => {
    return [
      {
        title: '流程名称',
        dataIndex: 'flowName'
      },
      {
        title: '流程类型',
        dataIndex: 'flowType'
      },
      {
        title: '当前步骤',
        dataIndex: 'currentStep'
      },
      {
        title: '申请时间',
        dataIndex: 'createTime'
      },
      {
        title: '发起人',
        dataIndex: 'startUser'
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (t) => EventStatus.map[t]
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime'
      },
      {
        title: '操作',
        key: 'action',
        render: () => {
          return (
            <ButtonGroup type="action">
              <Button>办理</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  return (
    <Card>
      <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
    </Card>
  )
}

export default List
