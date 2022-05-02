import { useSelector } from 'react-redux'

// actionTypes
const actionTypes = ['authorities/fetchAuthorities', 'dict/fetchDict']

// 全局数据是否全部加载完毕
const useLoading = () => {
  const loading = useSelector(({ loading }) => {
    return actionTypes.some((actionType) => loading.effects[actionType])
  })

  return loading
}

export default useLoading
