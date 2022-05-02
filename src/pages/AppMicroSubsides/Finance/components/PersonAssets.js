import React from 'react'
// import { useBankNormalConfig } from '../hooks/useFormConfig'
import { renderForm } from '@/utils/Form'
import Dynamic from './Dynamic'
import { usePersonAssetsConfig } from '../hooks/useFormConfig'

const PersonAssets = (props) => {
  const { form, id, initialValue, ...restProps } = props
  const personAssetsConfig = usePersonAssetsConfig(props.form, id)

  return (
    <Dynamic {...restProps}>
      {renderForm(personAssetsConfig, {
        form: form,
        initialValue: { ...initialValue, [`${id}/personAssets.id`]: id }
      })}
    </Dynamic>
  )
}

export default PersonAssets
