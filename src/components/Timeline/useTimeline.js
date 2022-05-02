import { useRequest, useBool } from '@dragon/hooks'

// asyncFunc: 获取timeline的接口函数
// extraProps: 额外的props
const useTimeline = (asyncFunc, extraProps = {}) => {
  const [flag, { toggle: refresh }] = useBool(false)

  const [fold, { toggle: toggleFold }] = useBool(false)

  const { data: steps = [] } = useRequest(asyncFunc, [flag], {
    onSuccess: (res) => {
      toggleFold(res.length > 5)
    }
  })

  return {
    refresh,
    props: {
      fold,
      toggleFold,
      steps,
      ...extraProps
    }
  }
}

export default useTimeline
