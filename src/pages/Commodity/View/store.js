import cpc from '@dragon/page-context'

const useValue = (props) => {
  const { id } = props

  return {
    id
  }
}

const [withProvider, usePageContext] = cpc(useValue)

export { withProvider, usePageContext }
