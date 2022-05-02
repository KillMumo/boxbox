import React from 'react'
import { Form } from 'antd'
import ModalForm from '@/components/ModalForm'
import { InputMoney } from '@/components/FormItems'
import { renderForm } from '@/utils/Form'
// import Upload from '@/components/Upload'

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
  colon: false
}

const FormItem = ({ value }) => <span>{value}%</span>

// 业务员通过
const CalculateForm = (props) => {
  const { form, ...restProps } = props

  const formConfig = [
    {
      itemProps: { label: '负债总额(元)' },
      condition: { required: true, name: '负债总额' },
      name: 'finDebtAmount',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '资产总额(元)' },
      condition: { required: true, name: '资产总额' },
      name: 'finAssetAmount',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '资产负债率' },
      name: 'finAssetDebtRate',
      children: <FormItem />
    },
    {
      itemProps: { label: '流动资产(元)' },
      condition: { required: true, name: '流动资产' },
      name: 'finFlowAsset',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '流动负债(元)' },
      condition: { required: true, name: '流动负债' },
      name: 'finFlowDebt',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '流动比率' },
      name: 'finFlowRate',
      children: <FormItem />
    },
    {
      itemProps: { label: '库存(元)' },
      condition: { required: true, name: '库存' },
      name: 'finStock',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '速动比率' },
      name: 'finQuickRate',
      children: <FormItem />
    },
    {
      itemProps: { label: '销售/营业成本(元)' },
      condition: { required: true, name: '销售/营业成本' },
      name: 'finCost',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '平均库存(元)' },
      condition: { required: true, name: '平均库存' },
      name: 'finAvgStock',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '存货周转率' },
      name: 'finTurnoverRate',
      children: <FormItem />
    }
  ]

  return (
    <ModalForm width={600} form={form} {...restProps}>
      <Form {...formLayout}>{renderForm(formConfig, { form: form })}</Form>
    </ModalForm>
  )
}

export default Form.create({
  onValuesChange: (props, changedValues, v) => {
    const changedFields = Object.keys(changedValues)
    const { setFieldsValue } = props.form
    const {
      finDebtAmount, // 负债总额
      finAssetAmount, // 资产总额
      finFlowAsset, // 流动资产
      finFlowDebt, //流动负债
      finStock, // 库存
      finCost, // 销售/营业成本
      finAvgStock //平均库存
    } = v
    let needChange = false

    // 资产负债率 = 负债总额 ÷ 资产总额
    const finAssetDebtRate = test(finDebtAmount / finAssetAmount)
    // 流动比率 = 流动资产 ÷ 流动负债
    const finFlowRate = test(finFlowAsset / finFlowDebt)
    // 速动比率 = ( 流动资产 － 库存 ) ÷ 流动负债
    const finQuickRate = test((finFlowAsset - finStock) / finFlowDebt)
    // 存货周转率 = 销售 ( 营业 ) 成本 ÷ 平均存货
    const finTurnoverRate = test(finCost / finAvgStock)

    const testFields = ['finAssetDebtRate', 'finFlowRate', 'finQuickRate', 'finTurnoverRate']
    testFields.forEach((f) => {
      if (!changedFields.includes(f)) {
        needChange = true
      }
    })
    if (needChange) {
      setFieldsValue({
        finAssetDebtRate,
        finFlowRate,
        finQuickRate,
        finTurnoverRate
      })
    }
  }
})(CalculateForm)

function test(n) {
  n = n * 100
  if (!isNaN(n) && n !== Infinity) {
    return n.toFixed(2)
  } else {
    return ''
  }
}
