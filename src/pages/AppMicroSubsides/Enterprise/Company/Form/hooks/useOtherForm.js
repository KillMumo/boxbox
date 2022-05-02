import { useRequest } from '@dragon/hooks'
import { fetchOtherData } from '@/services/microSubsidy/enterprise'
import { useState } from 'react'
import { decode } from '../store'

const useOtherForm = ({ supplyOtherUtils, agentOtherUtils, isSelf, toggle }) => {
  const { set: setSupplyOther } = supplyOtherUtils
  const { set: setAgentOther } = agentOtherUtils

  const [otherFormInit, setOtherFormInit] = useState()

  const { data = null, loading, start } = useRequest(fetchOtherData, {
    manual: true,
    onSuccess: (res) => {
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
