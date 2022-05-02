import { useArray, useRequest,useState } from '@dragon/hooks'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import { fetchCompanyInfo, fetchCompanyDetail2 } from '@/services/register'
import { fetchCompanyMixInfo } from '@/services/common'
import { fetchYear,saveCompanyname,fetchCompanyname } from '@/services/carbonAccount/accountView'
import { Select } from 'antd'
import React from 'react'

// 企业信息模糊搜索
// type: mix 表示 内部使用的详情接口，不是企查查
// onSearchSuccess: 选中搜索成功之后触发的方法
// disableSelect 选中后是否查详情，默认为true就是要查
// asyncFunc: 企查查 查询的方法（接口方法）

const useSearchCompany = (options = {}) => {
  const { onSearchSuccess = (res) => {}, type = '', disableSelect = false, asyncFunc } = options

  // autoComplete 里面的数据
  const [children, { set }] = useArray([])

  // 模糊搜索
  const { loading, start: fetchCompanyReq } = useRequest(fetchCompanyInfo, {
    manual: true,
    onSuccess: (res) =>
      set(
        res.map((i) => (
          <Select.Option value={i.name}>
            {i.name}
          </Select.Option>
        ))
      )
  })

  // 模糊搜索选中查询详情
  const { data: companyDetail = {}, start: fetchCompanyDetailReq, setData } = useRequest(
    asyncFunc ? asyncFunc : type === 'mix' ? fetchCompanyMixInfo : fetchCompanyDetail2,
    {
      manual: true,
      onSuccess: onSearchSuccess
    }
  )

  // 选中时触发查询详情
  const onSelect = useCallback(
    (v, c) => {
      const { key } = c
      if (!disableSelect) {
        saveCompanyname(v)
        console.log('msjsmj',fetchYear(),fetchCompanyname())
        fetchCompanyDetailReq({ companyName: v,year:fetchYear()})
      }
    },
    [disableSelect, fetchCompanyDetailReq,fetchYear() ]
  )

  // 输入值时延迟触发
  const onSearch = useCallback(
    debounce((v, c) => {
      console.log('pppp',v)
      fetchCompanyReq({
        name: v
      })
    }, 300),
    [fetchCompanyReq]
  )

  return {
    companyDetail,
    setCompanyDetail: setData,
    props: {
      loading,
      showSearch: true,
      children,
      onSearch,
      onSelect,
      filterOption: false
    }
  }
}

export default useSearchCompany
