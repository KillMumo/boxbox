import React, { useState, useEffect, useMemo, useRef } from 'react'
import Card from '@/components/Card'
import { Form, Table } from 'antd'
import SearchForm from '@/components/SearchForm'
import { getIndustryList } from '@/services/carbon/dataAnalyse'

const IndustryList = (props) => {
  const searchFormRef = useRef()
  const [loading, loadingchange] = useState(false)
  const [dataSource, setDataSource] = useState([])

  const columns = useMemo(() => {
    return [
      {
        title: '排名',
        dataIndex: 'num',
        width: 84
      },
      {
        title: '行业',
        dataIndex: 'industry',
        width: 185,
        ellipsis: true
      },
      {
        title: '企业数',
        dataIndex: 'number',
        width: 109,
        ellipsis: true,
        sorter: (a, b) => a.number - b.number
      },

      {
        title: '碳排(吨)',
        dataIndex: 'total',
        width: 126,
        ellipsis: true,
        sorter: (a, b) => a.total - b.total
      },
      {
        title: '亩均(吨/亩)',
        dataIndex: 'mtotal',
        width: 118,
        ellipsis: true,
        sorter: (a, b) => a.mtotal - b.mtotal
      },
      {
        title: '增值(千克/万元)',
        dataIndex: 'ntotal',
        width: 118,
        ellipsis: true,
        sorter: (a, b) => a.ntotal - b.ntotal
      }
    ]
  })

  const requestData = (params) => {
    loadingchange(true)
    getIndustryList(params)
      .then((res) => {
        setDataSource(
          (res || []).map((el, index) => {
            el.num = index + 1
            return el
          })
        )
      })
      .finally(() => {
        loadingchange(false)
      })
  }

  useEffect(() => {
    if (searchFormRef && searchFormRef.current) {
      searchFormRef.current.search()
    }
  }, [searchFormRef])

  return (
    <Card>
      <SearchForm
        myRef={searchFormRef}
        show={{
          district: true,
          year: true
        }}
        defaultValue={{ year: '2020' }}
        search={requestData}
      />
      <Table
        rowKey="name"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  )
}

export default IndustryList
