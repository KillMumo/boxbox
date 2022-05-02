import React from 'react'
// import { useBankNormalConfig } from '../hooks/useFormConfig'
import { renderForm } from '@/utils/Form'
import Dynamic from './Dynamic'
import { useOrgAssetsConfig } from '../hooks/useFormConfig'

const OrgAssets = (props) => {
  const { form, id, initialValue, ...restProps } = props
  const assetsConfig = useOrgAssetsConfig(props.form, id)

  return (
    <Dynamic {...restProps}>
      {renderForm(assetsConfig, {
        form: form,
        initialValue: { ...initialValue, [`${id}/orgAssets.id`]: id }
      })}
    </Dynamic>
  )
}

export default OrgAssets
