import { useRequest } from '@dragon/hooks'
import { useCallback } from 'react'
import { login } from '@/services/user'
import { saveToken,saveOrgId } from '@/common/token'
import router from 'umi/router'
import { message } from 'antd'
import useGraphCode from './useGraphCode'

// 传参：
// 一个form实例
// prodCode和tenantId
const useLogin = (form, { prodCode = '', tenantId = '' }) => {
  // 获取验证码
  const { graph, fetchGraph } = useGraphCode('login')

  // 登录
  const { loading, start: loginReq } = useRequest(login, {
    manual: true,
    onSuccess: (r) => {
      saveToken(r);
      router.push('/home')
      message.success('登录成功')
    }
  })

  // 登录提交
  const handleLogin = useCallback(
    (e) => {
      e.preventDefault()
      form.validateFields(async (err, values) => {
        if (!err) {
          const res = await loginReq({
            ...values,
            graphId: graph.graphId,
            prodCode,
            tenantId
          })
          if (res instanceof Error) {
            fetchGraph()
          }
        }
      })
    },
    [fetchGraph, form, graph.graphId, loginReq, prodCode, tenantId]
  )

  return {
    graph,
    fetchGraph,
    loading,
    handleLogin
  }
}

export default useLogin
