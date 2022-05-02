import React from 'react'
import { usePageContext } from '../store'
import Dynamic from './Dynamic'
import AddButton from './AddButton'
import { useBankNormalConfig } from '../form.config'
import { renderForm } from '@/utils/Form'

const BankNormal = (props) => {
  const { form, id, initialValue, ...restProps } = props
  const bankNormalConfig = useBankNormalConfig(props.form, id)

  return (
    <Dynamic title="一般户" {...restProps}>
      {renderForm(bankNormalConfig, { form: form, initialValue })}
    </Dynamic>
  )
}

const NormalBankForm = (props) => {
  const {
    form,
    normalForm: { normalList, remove, push, canAdd }, // 一般户表单
    edit: { initialValue }
  } = usePageContext()

  return (
    <React.Fragment>
      {normalList.map((s, i) => (
        <BankNormal
          key={s.bankNumber}
          form={form}
          id={s.bankNumber}
          initialValue={initialValue}
          title={`一般户${i + 1}`}
          length={normalList.length}
          deleteItem={() => remove((d) => d.bankNumber === s.bankNumber)}
        />
      ))}
      {canAdd && <AddButton onClick={() => push({ bankNumber: Date.now() })}>添加一般户</AddButton>}
    </React.Fragment>
  )
}

export default NormalBankForm
