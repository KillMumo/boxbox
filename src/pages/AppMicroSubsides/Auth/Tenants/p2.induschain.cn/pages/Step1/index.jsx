import React from 'react'
import Panel from '../../components/Panel'
import ButtonGroup from '@/components/ButtonGroup'
import { useCompanyConfig, useAdminConfig } from './form.config'
import { usePageContext } from '../../store'
import { ConfigForm } from '@dragon/form'
import { Button } from 'antd'

const Step1 = (props) => {
  const {
    form,
    step: { next },
    loading: { nextLoading }
  } = usePageContext()
  const companyConfig = useCompanyConfig(form)
  const adminConfig = useAdminConfig(form)

  return (
    <div>
      <Panel title="企业基本信息">
        <ConfigForm config={companyConfig} />
      </Panel>
      <Panel title="管理员信息">
        <ConfigForm config={adminConfig} />
      </Panel>
      <ButtonGroup align="center">
        <Button type="primary" onClick={next} loading={nextLoading}>
          下一步
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default Step1
