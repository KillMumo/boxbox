import cpc from '@dragon/page-context'
import { useState, useCallback } from 'react'
import { message } from 'antd'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'

const useIndex = (props) => {
  const { form, id } = props

  // 编辑提交
  // const { loading: updateLoading, start: updateReq } = useRequest(updateCourse, {
  //   manual: true
  // })

  // // 申请添加
  // const { loading: submitLoading, start: submitReq } = useRequest(addCourse, {
  //   manual: true,
  //   onSuccess: () => {
  //     router.push('/courseManage/courses')
  //     message.success('添加成功')
  //   }
  // })

  return {
    form,
    id
    // edit: {
    //   updateLoading,
    //   updateReq
    // },
    // add: {
    //   submitLoading,
    //   submitReq
    // }
  }
}

const [withProvider, usePageContext] = cpc(useIndex)
export { withProvider, usePageContext }
