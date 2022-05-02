import { useRequest } from '@dragon/hooks'
import { message } from 'antd'
import { fetchOtherData } from '@/services/microSubsidy/enterprise'
import { useState } from 'react'
import { decode } from '../store'

const useOtherForm = ({ supplyOtherUtils, agentOtherUtils, isSelf, toggle }) => {
  const { set: setSupplyOther } = supplyOtherUtils
  const { set: setAgentOther } = agentOtherUtils

  const [otherFormInit, setOtherFormInit] = useState({})

  const { data = null, loading, start } = useRequest(fetchOtherData, {
    manual: true,
    onSuccess: (res) => {
      const { type } = res
      if (type === 0) {
        message.error('获取数据失败')
      }

      if (type === 2) {
        message.error('很抱歉，您未授权成功，请检查是否已完成授权')
      }

      setOtherFormInit(decode(res))
      setSupplyOther(res.supplierOther || [])
      setAgentOther(res.clientOther || [])
    }
  })

  return {
    isSelf,
    toggle,
    loading,
    fetch: start,
    data,
    otherFormInit
  }
}

export default useOtherForm
