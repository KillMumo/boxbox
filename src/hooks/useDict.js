import { useSelector } from 'react-redux'

// 获取字典的hook
// code: 字典的code 比如 org_type finance_status 等
const useDict = (code) => {
  const dict = useSelector(({ dict }) => dict[code])
  return dict || {}
}

export default useDict
