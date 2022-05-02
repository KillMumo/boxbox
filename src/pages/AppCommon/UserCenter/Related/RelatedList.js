import React, { useMemo, useCallback } from 'react'
import { Button } from 'antd'
import PagingTable from '@/components/PagingTable'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { connect } from 'react-redux'
import { useTable } from '@dragon/hooks'
import { getOrgRelation } from '@/services/userCenter'

const List = () => {
  // 当前企业信息
  //const { companyInfo } = props
  // 当前企业类型
  //const orgType = companyInfo.orgType
  //const scmType = orgType==='4'? "COREofFACTOR":orgType==='3'?"FACTOR":""

  // 查询列表
  const { tableProps } = useTable(getOrgRelation)

  const columns = useMemo(() => {
    return [
      {
        title: '企业名称',
        dataIndex: 'orgName',
        align: 'left'
      },
      {
        title: '联系人',
        dataIndex: 'legalPerson',
        align: 'left'
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        align: 'left'
      },
      {
        title: '企业类型',
        dataIndex: 'relType',
        align: 'left'
      }
    ]
  }, [])
  // 渲染表格
  /*  const renderTable = useCallback(() => {
    const columns = [
      {
        title: '企业名称',
        dataIndex: 'orgName',
        align: 'left'
      },
      {
        title: '联系人',
        dataIndex: 'legalPerson',
        align: 'left'
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        align: 'left'
      }
    ]

    const handleExportToExcel = () => {
      console.log('导出excel')
    }

    return (
      <React.Fragment>
        <ButtonGroup>{<Button onClick={handleExportToExcel}>导出Excel</Button>}</ButtonGroup>
        <PagingTable columns={columns} {...tableProps}/>
      </React.Fragment>
    )
  }, [tableProps])*/

  //tab切换
  /*const handleTabChange = useCallback((key) => {
    searchBy({ scmType: key })
  }, [searchBy])*/

  // 左侧按钮组
  const renderButtonGroup = useCallback(() => {
    //导出excel
    const handleExportToExcel = () => {
      console.log('测试导出excel')
    }

    return (
      <ButtonGroup>
        <Button onClick={handleExportToExcel}>导出Excel</Button>
      </ButtonGroup>
    )
  }, [])

  return (
    <Card>
      {/*<Tabs animated={false} defaultActiveKey="FACTOR" onChange={handleTabChange}>
        <Tabs.TabPane tab={orgType==='4'? "我的成员企业": "我的核心企业"} key={scmType}>
          {renderTable()}
        </Tabs.TabPane>
        {orgType==='1'? "":
        <Tabs.TabPane tab="保理商" key="FACTOR">
          {renderTable()}
        </Tabs.TabPane>}
      </Tabs>*/}
      {renderButtonGroup()}
      <PagingTable columns={columns} {...tableProps} />
    </Card>
  )
}

export default connect(({ companyInfo }) => ({
  companyInfo: companyInfo.companyInfo
}))(List)
