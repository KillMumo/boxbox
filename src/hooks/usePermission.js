import { useSelector } from 'react-redux'

/**
 *
 * @param {权限code} code
 * @param {需要判断是否显示的组件} element
 */
const usePermission = (code, element) => {
  const codes = useSelector(({ authorities }) => authorities.button.buttons)

  const hasAuth = codes.includes(code)

  // element 如果不传，则返回是否有权限，如果传了则返回经过权限校验后的组件
  if (element) {
    return hasAuth ? element : () => null
  }

  return hasAuth
}

export default usePermission
