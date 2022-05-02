import { useRequest } from '@dragon/hooks'
import { useCallback } from 'react'
import { login, preLogin, msLogin } from '@/services/user'
import { saveToken ,saveOrgId} from '@/common/token'
import router from 'umi/router'
import useGraphCode from '@/hooks/useGraphCode'
import { message } from 'antd'
import { useSelector } from 'react-redux'

// 传参：
// 一个form实例
const useLogin = (form) => {
  const { validateFields, getFieldsValue } = form

  // 获取验证码
  const { graph, fetchGraph } = useGraphCode('login')
  // redux数据
  const { pageConfig } = useSelector(({ pageConfig }) => ({
    pageConfig
  }))

  // 登录
  const { loading: loginLoading, start: loginReq } = useRequest(login, {
    manual: true,
    onSuccess: (r) => {
      saveToken(r);

      message.success('登录成功')
      router.push('/home')
    }
  })

  // 预登陆
  const { loading: preLoginLoading, start: preLoginReq } = useRequest(preLogin, {
    manual: true,
    onSuccess: (tenants) => {
      const values = getFieldsValue(['account', 'password'])
      const params = {
        ...values,
        tenantId: tenants[0]?.tenant?.tenantId || '',
        prodCode: tenants[0]?.product[0]?.prodCode || ''
      }
      loginReq(params)
    }
  })

  // 预登录提交
  const handlePreLogin = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          const res = await preLoginReq({
            ...values,
            graphId: graph.graphId
          })
          if (res instanceof Error) {
            fetchGraph()
          }
        }
      })
    },
    [fetchGraph, graph.graphId, preLoginReq, validateFields]
  )

  // 小微的登录
  const { loading: msLoginLoading, start: msloginReq } = useRequest(msLogin, {
    manual: true,
    onSuccess: (r) => {
      saveToken(r);
      message.success('登录成功')
      router.push('/home')
    }
  })

  // 小微的登录提交
  const handleLogin = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          const res = await msloginReq({
            ...values,
            graphId: graph.graphId,
            inviteCode: pageConfig?.inviteCode
          })
          if (res instanceof Error) {
            fetchGraph()
          }
        }
      })
    },
    [validateFields, msloginReq, graph.graphId, pageConfig, fetchGraph]
  )

  return {
    graph, // 验证码信息
    fetchGraph, // 获取验证码的方法
    loading: preLoginLoading || loginLoading || msLoginLoading, // 登录按钮loading
    handlePreLogin, // 登录提交方法
    handleLogin //小微的登录提交方法
  }
}

export default useLogin
