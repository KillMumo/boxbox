import React from 'react'
import Card from '@/components/Card'
import { usePageContext } from '../store'
import { renderForm } from '@/utils/Form'

const BasicInfo = (props) => {
  const {
    form,
    basicForm: { basicConfig }, // 企业信息表单
    edit: { initialValue }
  } = usePageContext()

  return (
    <Card title={<span id="企业信息">企业信息</span>}>
      {renderForm(basicConfig, {
        form,
        initialValue: {
          'legalPerson.isRealControlPerson': 1,
          ...initialValue
        }
      })}
    </Card>
  )
}

export default BasicInfo
