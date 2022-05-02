import cpc from '@dragon/page-context'
import { useRequest } from '@dragon/hooks'
import { useTimeline } from '@/components/Timeline'
import { fetchDetail, fetchDetailTimeline } from '@/services/microSubsidy/userCenter'
import { useSelector } from 'react-redux'

const useIndex = (props) => {
  const orgId = useSelector(({ user }) => user.user.orgId)

  const { loading, data = {} } = useRequest(() => fetchDetail(orgId))

  const { props: timelineProps } = useTimeline(() => fetchDetailTimeline(orgId), {
    showExtra: false
  })

  return {
    loading,
    data,
    timelineProps
  }
}

const [withProvider, usePageContext] = cpc(useIndex)

export { withProvider, usePageContext }
