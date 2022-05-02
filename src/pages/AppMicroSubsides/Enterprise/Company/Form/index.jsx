import React from 'react'
import Card from '@/components/Card'
import { withProvider, usePageContext } from './store'
import { Form, Button } from 'antd'
import BasicInfoForm from './components/BasicInfoForm'
import BasicBankForm from './components/BasicBankForm'
import NormalBankForm from './components/NormalBankForm'
import RelationForm from './components/RelationForm'
import FamilyForm from './components/FamilyForm'
import AdminForm from './components/AdminForm'
import ButtonGroup from '@/components/ButtonGroup'
import Anchor from '@/components/Anchor'

const formLayout = {
  labelAlign: 'left',
  labelCol: { span: 4 },
  wrapperCol: { span: 7 },
  colon: false
}

const anchorList = ['企业信息', '银行账户信息', '供销关系', '关联人', '管理员信息'].map((i) => ({
  key: i,
  tab: i
}))

const AddAndEdit = (props) => {
  const {
    location: { pathname }
  } = props

  const isEdit = pathname.indexOf('edit') !== -1

  const {
    apply: { loading: applyLoading, handleSubmit: handleApply },
    edit: { loading, submitting: editLoading, handleSubmit: handleEdit }
  } = usePageContext()

  return (
    <Card loading={loading} transparent>
      <Anchor anchorList={anchorList} />
      <Form {...formLayout} onSubmit={isEdit ? handleEdit : handleApply}>
        <BasicInfoForm />
        <Card title={<span id="银行账户信息">银行账户信息</span>}>
          <BasicBankForm />
          <NormalBankForm />
        </Card>
        <RelationForm />
        <Card title={<span id="关联人">关联人</span>}>
          <FamilyForm title="父母" contextKey="parentForm" />
          <FamilyForm title="配偶" contextKey="mateForm" />
          <FamilyForm title="子女" contextKey="childForm" />
        </Card>
        <AdminForm />
        <ButtonGroup fixed align="center">
          <Button loading={applyLoading || editLoading} type="primary" htmlType="submit">
            确定
          </Button>
        </ButtonGroup>
      </Form>
    </Card>
  )
}

const mapPropsToProvider = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  return {
    id,
    form: props.form
  }
}

const Page = withProvider(mapPropsToProvider)(AddAndEdit)

export default Form.create()(Page)
