import cpc from '@dragon/page-context'

const useValue = (props) => {
  const { form, id, isEdit } = props

  return {
    form,
    id,
    isEdit
  }
}

const [withProvider, usePageContext] = cpc(useValue)

export { withProvider, usePageContext }
