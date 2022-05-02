import { fetchGraph } from '@/services/common'
import { useRequest } from '@dragon/hooks'
import { useCallback } from 'react'

// 获取图形验证码
// type: login / 其他
const useGraphCode = (type) => {
  const { data: graph = { graphSource: '' }, start: fetchGraphReq } = useRequest((p) =>
    fetchGraph({
      type,
      ...p
    })
  )

  // 点击验证码
  const handleChangeCode = useCallback(() => {
    fetchGraphReq({
      replaceId: graph.graphId
    })
  }, [fetchGraphReq, graph.graphId])

  return {
    graph,
    fetchGraph: handleChangeCode
  }
}

export default useGraphCode
