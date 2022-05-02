import React from 'react'
import Panel from '../../components/Panel'
import { usePageContext } from '../../store'
import { useBankConfig } from './form.config'
import ButtonGroup from '@/components/ButtonGroup'

import { Button } from 'antd'
import { ConfigForm } from '@dragon/form'

const Step2 = (props) => {
  const {
    isEdit,
    step: { onPrevious, handleSubmit },
    loading: { submitLoading }
  } = usePageContext()

  // 基本户表单信息
  const bankFormConfig = useBankConfig(isEdit)

  return (
    <div>
      <Panel title="银行基本户信息">
        <ConfigForm config={bankFormConfig} />
      </Panel>
      <ButtonGroup align="center">
        <Button onClick={onPrevious}>上一步</Button>
        <Button type="primary" onClick={handleSubmit} loading={submitLoading}>
          下一步
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default Step2
