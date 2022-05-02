import React, { useMemo } from 'react'
import Card from '@/components/Card'
import { useTable } from '@dragon/hooks'
import { fetchDoneList } from '@/services/instance'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { EventStatus } from '@/common/map'
import { Button } from 'antd'

const List = () => {
  const { tableProps } = useTable(fetchDoneList)

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
        render: (t) => {
          return (
            <ButtonGroup type="action">
              <Button>详情</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  return (
    <Card>
      <PagingTable columns={columns} {...tableProps} />
    </Card>
  )
}

export default List
