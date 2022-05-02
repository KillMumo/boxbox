import React, { useMemo } from 'react'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import PagingTable from '@/components/PagingTable'
import { Button, Form } from 'antd'
import { useTable } from '@dragon/hooks'
import { fetchDetail, fetchFinanceList, fetchBizStatus } from '@/services/microSubsidy/statistic'
import { useRequest } from '@dragon/hooks'
import { formatMoney } from '@/utils'
import { CompanyBasicInfo } from '../../components/Detail'
import Link from 'umi/link'
import router from 'umi/router'

const View = (props) => {
  const {
    match: {
      params: { orgId }
    }
  } = props

  //企业详情
  const { data: info = {}, loading: fetching } = useRequest(() => fetchDetail(orgId))

  //融资信息列表
  const { tableProps } = useTable(fetchFinanceList, {
    defaultFilters: { orgId }
  })

  // 融资编号跳转
  const handleBizLink = (bizNo) => {
    fetchBizStatus({ bizNo: bizNo }).then((res) => {
      if (res instanceof Error) return
      let url = ''
      // res：true=贷后
      url = res ? `/msPostLoan/management/view/${bizNo}` : `/msFinance/view/${bizNo}`
      router.push(url)
    })
  }

  //融资信息表头
  const columns = useMemo(() => {
    return [
      {
        title: '担保编号',
        dataIndex: 'bizNo',
        ellipsis: true
      },
      {
        title: '申请担保金额(元)',
        dataIndex: 'extra.applyFinanceAmount',
        align: 'right',
        ellipsis: true,
        width: 180,
        render: (t) => formatMoney(t)
      },
      {
        title: '状态',
        dataIndex: 'bizStatus',
        ellipsis: true
      },
      {
        title: '最新操作时间',
        dataIndex: 'updateTime',
        ellipsis: true,
        width: 180
      },
      {
        title: '资金用途',
        dataIndex: 'extra.financePurpose'
        //ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        ellipsis: true,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button onClick={() => handleBizLink(r.bizNo)}>查看</Button>
            </ButtonGroup>
          )
        }
      }
    ]
  }, [])

  return (
    <Card transparent>
      <Card title="企业信息" loading={fetching}>
        <CompanyBasicInfo
          data={{
            uid: info.uid,
            ...info.companyBasicInfoVO,
            ...info.legalPersonVO,
            ...info.realControlPerson
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <Link to={`/msEnterprise/company/view/${orgId}`}>查看详情</Link>
        </div>
      </Card>
      <Card title="担保信息">
        <PagingTable columns={columns} {...tableProps} rowKey={(i) => i.id} />
      </Card>
    </Card>
  )
}

export default Form.create()(View)
