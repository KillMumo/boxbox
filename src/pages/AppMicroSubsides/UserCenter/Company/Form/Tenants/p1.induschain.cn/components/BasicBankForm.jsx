import React from 'react'
import Card from '@/components/Card'
import { usePageContext } from '../store'
import { renderForm } from '@/utils/Form'

const BasicInfo = (props) => {
  const {
    form,
    bankForm: { bankConfig },
    edit: { initialValue }
  } = usePageContext()

  return (
    <Card.SubCard title="基本户">{renderForm(bankConfig, { form, initialValue })}</Card.SubCard>
  )
}

export default BasicInfo
