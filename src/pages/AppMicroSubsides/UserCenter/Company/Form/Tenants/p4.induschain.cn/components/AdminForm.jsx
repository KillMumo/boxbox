import React from 'react'
import Card from '@/components/Card'
import { renderForm } from '@/utils/Form'
import { usePageContext } from '../store'

const AdminForm = () => {
  const {
    form,
    adminForm: { adminConfig },
    edit: { initialValue }
  } = usePageContext()

  return (
    <Card title={<span id="管理员信息">管理员信息</span>}>
      {renderForm(adminConfig, { form, initialValue })}
    </Card>
  )
}

export default AdminForm
