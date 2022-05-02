import cpc from '@dragon/page-context'
import { useNumber, usePersistFn, useRequest } from '@dragon/hooks'
import { useCallback, useEffect } from 'react'
import router from 'umi/router'
import { fetchRegisterInfoForAuth } from '@/services/register'
import { submitStep1, submitStep2, getBankInfo } from '@/services/msAuth'
import { saveState, fetchState } from '@/common/store'

const useValue = (props) => {
  const { form, isEdit } = props

  // 当前步骤
  // const [current, { increment, decrement }] = useNumber(1)

  // 获取注册填的信息
  // const { loading: registerLoading, data: registerInfo } = useRequest(fetchRegisterInfoForAuth)
  // 获取第二步填的信息
  // const { loading: bankLoading, data: bankInfo } = useRequest(getBankInfo)
  // const { loading: nextLoading, start: step1Req } = useRequest(submitStep1, {
  //   manual: true
  // })
  // const { loading: submitLoading, start: submitReq } = useRequest(submitStep2, {
  //   manual: true
  // })
  // 本地暂存的认证第一步填的信息
  // const bizCheckInfoSubmitRO = fetchState('bizCheckInfoSubmitRO')
  // 本地暂存的认证第二步填的信息
  // const bizSubmitBankInfo = fetchState('bizSubmitBankInfo')

  // 上一步
  // const onPrevious = usePersistFn((value) => {
  //   saveState({ ...form.getFieldsValue() }, 'bizSubmitBankInfo')
  //   decrement()
  // })

  // 下一步
  // const next = useCallback(() => {
  //   form.validateFieldsAndScroll(async (err, values) => {
  //     if (!err) {
  //       const res = await step1Req(values)
  //       if (res instanceof Error) return
  //       saveState(values, 'bizCheckInfoSubmitRO')
  //       increment()
  //     }
  //   })
  // }, [form, increment, step1Req])

  // 提交
  // const handleSubmit = usePersistFn((e) => {
  //   e.preventDefault()
  //   form.validateFieldsAndScroll(async (err, values) => {
  //     if (!err) {
  //       const res = await submitReq({
  //         bizCheckInfoSubmitRO: { ...bizCheckInfoSubmitRO },
  //         bizSubmitBankInfo: { ...values }
  //       })
  //       if (res instanceof Error) return
  //       router.push(`/authResult`)
  //     }
  //   })
  // })

  // useEffect(() => {
  //   saveState({ ...registerInfo?.checkMaterial }, 'bizCheckInfoSubmitRO')
  //   saveState({ ...bankInfo }, 'bizSubmitBankInfo')
  // }, [bankInfo, registerInfo])

  return {
    form,
    //是否为修改页面
    isEdit
    // 步骤的信息
    // step: { current, next, onPrevious, handleSubmit },
    // initialValue: {
    //   ...registerInfo,
    //   // ...registerInfo?.checkMaterial,
    //   // ...bankInfo,
    //   ...bizCheckInfoSubmitRO,
    //   ...bizSubmitBankInfo
    // },
    // loading: { registerLoading, bankLoading, nextLoading, submitLoading } //各种loading
  }
}

const [withProvider, usePageContext] = cpc(useValue)

export { withProvider, usePageContext }
