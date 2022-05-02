import React from 'react'
import { usePageContext, enhanceConfig } from '../store'
import Dynamic from './Dynamic'
import AddButton from './AddButton'
import { renderForm } from '@/utils/Form'

const NormalBankForm = (props) => {
  const { contextKey, title } = props
  const {
    form,
    [contextKey]: { config, list, remove, push, canAdd },
    edit: { initialValue }
  } = usePageContext()

  return (
    <React.Fragment>
      {list.map((s, i) => (
        <Dynamic
          key={s.name}
          title={`${title}${i + 1}`}
          length={list.length}
          deleteItem={() => remove((d) => d.name === s.name)}
        >
          {renderForm(enhanceConfig(config, s.name), { form, initialValue })}
        </Dynamic>
      ))}
      {canAdd && <AddButton onClick={() => push({ name: Date.now() })}>添加{title}</AddButton>}
    </React.Fragment>
  )
}

export default NormalBankForm
