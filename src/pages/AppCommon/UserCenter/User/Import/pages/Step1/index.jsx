import React, { useMemo } from 'react'
import { Input, Button, Row, Col } from 'antd'
import { useTable } from '@dragon/hooks'
import { getOrgUserList } from '@/services/userManagement'
import ButtonGroup from '@/components/ButtonGroup'
import { usePageContext } from '../../store'
import PagingTable from '@/components/PagingTable'
import styles from '../../styles.less'
import router from 'umi/router'

const { Search } = Input

const Page = (props) => {
  const { searchBy, tableProps } = useTable(getOrgUserList)
  const {
    step: { next },
    select: { selectRows, setSelectRows, selectRecords1, setSelectRecords1 }
  } = usePageContext()

  const columns = useMemo(() => {
    return [
      {
        title: '用户姓名',
        dataIndex: 'userName'
      },
      {
        title: '手机号',
        dataIndex: 'account'
      },
      {
        title: '所属机构',
        dataIndex: 'orgName'
      }
    ]
  }, [])

  // 当列表进行选择时
  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: selectRows,
      onChange: (key, records) => {
        setSelectRows(key)
        setSelectRecords1({ records: format(key.map((item) => JSON.parse(item))) })
      },
      getCheckboxProps: (r) => ({
        disabled: r.isAdmin
      })
    }),
    [selectRows, setSelectRecords1, setSelectRows]
  )

  const clear = () => {
    setSelectRows([])
    setSelectRecords1([])
  }

  return (
    <React.Fragment>
      <Row>
        <Col className={styles.select} span={12}>
          <span className={styles.selectText}>{`已选择 `}</span>
          <span className={styles.selectedNum}>{selectRows.length}</span>
          <span> 位</span>
          <span>
            <Button type="link" onClick={clear}>
              清空
            </Button>
          </span>
        </Col>
        <Col className={styles.search} span={12}>
          <Search
            onSearch={(value) => searchBy({ userName: value })}
            style={{ width: 200 }}
            placeholder="请输入用户姓名"
          />
        </Col>
      </Row>
      <PagingTable
        rowKey={(i) => JSON.stringify(i)}
        rowSelection={rowSelection}
        columns={columns}
        style={{ marginBottom: 10 }}
        {...tableProps}
      />
      <ButtonGroup fixed align="center">
        <Button type="primary" onClick={next} disabled={selectRows.length === 0}>
          下一步
        </Button>
        <Button onClick={() => router.replace('/userCenter/user')}>取消</Button>
      </ButtonGroup>
    </React.Fragment>
  )
}

export default Page

function format(arr) {
  let newArr = []
  arr.forEach((current) => {
    let newObj = {}
    for (let i in current) {
      if (i === 'id') {
        newObj['userId'] = current[i].toString()
      } else newObj[i] = current[i]
    }
    newArr.push(newObj)
  })
  return newArr
}
