import { useRequest } from '@dragon/hooks'
import { sendVerifyCode } from '@/services/register'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

// type： 后端规定的type
// form: form实例
// validateFieldsName：发送验证码时需要校验的字段
// onError： 报错时触发
const useMessageCode = (type, { form = {}, validateFieldsName = '', onError = () => {} }) => {
  const { validateFields } = form

  const prodCode = useSelector(({ prodCode }) => prodCode)

  const { loading, start: sendCodeReq } = useRequest(
    (params) =>
      sendVerifyCode({
        ...params,
        type,
        prodCode
      }),
    { manual: true }
  )

  const send = useCallback(
    (startCount) => {
      const fields = Array.isArray(validateFieldsName) ? validateFieldsName : [validateFieldsName]
      validateFields(fields, async (err, values) => {
        if (!err) {
          const res = await sendCodeReq({
            phone: values[fields[0]]
          })
          if (res instanceof Error) {
            onError()
            return
          }
          startCount()
        }
      })
    },
    [onError, sendCodeReq, validateFields, validateFieldsName]
  )

  return {
    loading,
    send
  }
}

export default useMessageCode
