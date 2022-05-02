import React, { useState, useEffect, useMemo, useRef } from 'react'
import Card from '@/components/Card'
import { Form, Table } from 'antd'
import SearchForm from '@/components/SearchForm'
import { getGreenCompanyList } from '@/services/carbon/dataAnalyse'
import lowIcon from '@/assets/icons/标签_低碳@2x.svg'
import midIcon from '@/assets/icons/标签_中碳@2x.svg'
import highIcon from '@/assets/icons/标签_高碳@2x.svg'

const iconMap = {
  高: highIcon,
  中: midIcon,
  低: lowIcon
}

const IndustryList = (props) => {
  const searchFormRef = useRef()
  const [loading, loadingchange] = useState(false)
  const [dataSource, setDataSource] = useState([])

  const columns = useMemo(() => {
    return [
      {
        title: '排名',
        dataIndex: 'num',
        width: 40
      },
      {
        title: '企业名称',
        dataIndex: 'name',
        width: 150
      },
      {
        title: '行业',
        dataIndex: 'industry',
        width: 120,
        ellipsis: true
      },
      {
        title: '街道',
        dataIndex: 'district',
        width: 70,
        ellipsis: true
      },
      {
        title: '碳排(吨)',
        dataIndex: 'total',
        width: 60,
        ellipsis: true,
        sorter: (a, b) => a.total - b.total,
        render: (v, r) => (
          <div>
            <img width="14" src={iconMap[r.level]} />
            <span style={{ marginLeft: 6 }}>{v}</span>
          </div>
        )
      },
      {
        title: '亩均(吨/亩)',
        dataIndex: 'mtotal',
        width: 70,
        ellipsis: true,
        sorter: (a, b) => a.mtotal - b.mtotal,
        render: (v, r) => (
          <div>
            <img width="14" src={iconMap[r.mlevel]} />
            <span style={{ marginLeft: 6 }}>{v}</span>
          </div>
        )
      },
      {
        title: '增值(千克/万元)',
        dataIndex: 'ntotal',
        width: 90,
        ellipsis: true,
        sorter: (a, b) => a.ntotal - b.ntotal,
        render: (v, r) => (
          <div>
            <img width="14" src={iconMap[r.nlevel]} />
            <span style={{ marginLeft: 6 }}>{v}</span>
          </div>
        )
      },
      {
        title: '荣誉',
        dataIndex: 'honour',
        width: 160,
        ellipsis: true
      }
    ]
  })

  const requestData = (params) => {
    loadingchange(true)
    getGreenCompanyList(params)
      .then((res) => {
        setDataSource(
          (res || []).map((el, index) => {
            el.num = index + 1
            return el
          })
        )
        console.log(res)
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
          year: true,
          industry: true,
          companyName: true
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
