import { useArray, useRequest } from '@dragon/hooks'
import React, { useCallback, useState } from 'react'
import debounce from 'lodash/debounce'
import { fuzzySearch, isComplete, getAccount } from '@/services/microSubsidy/finance'
import { Icon } from 'antd'
import Link from 'umi/link'

// 企业信息模糊搜索
// onSearchSuccess: 选中搜索成功之后触发的方法
const useSearchCompanyForApply = (options = {}) => {
  //const { onSearchSuccess = (res) => {} } = options
  const [extra, setExtra] = useState()
  //const [ perfection,setPerfecttion] = useState()

  // autoComplete 里面的数据
  const [dataSource, { set }] = useArray([])

  // 模糊搜索
  const { start: fetchFuzzySearchReq } = useRequest(fuzzySearch, {
    manual: true,
    onSuccess: (res) => {
      set(res)
      if (res.length === 0) {
        setExtra(extra1)
      } else {
        setExtra()
      }
    }
  })

  // 获取银行账号列表
  const { data: bankAccountList = [], start, setData: setList } = useRequest(getAccount, {
    manual: true
  })

  // 模糊搜索选中查询完善度
  const { data: companyDetail = {}, start: fetchCompanyDetailReq, setData, loading } = useRequest(
    isComplete,
    {
      manual: true,
      //onSuccess: onSearchSuccess
      onSuccess: (res) => {
        if (!res.isComplete) {
          setExtra(extra2(res.orgId))
        } else {
          setExtra(
            <span>
              <Icon
                type="check-circle"
                style={{ color: 'rgba(104, 210, 121, 1)', marginRight: 5 }}
                theme="filled"
              />
              信息完善分{res.infoPerfection},
              <Link to={`/msEnterprise/company/view/${res.orgId}`}>查看企业信息</Link>
            </span>
          )
        }
        start({ orgName: res.orgName })
      }
    }
  )

  // useEffect(() => {
  //   fetchFuzzySearchReq({ orgName: '' })
  // }, [fetchFuzzySearchReq])

  // 选中时触发查询详情
  const onSelect = useCallback(
    (v) => {
      fetchCompanyDetailReq({ orgName: v })
    },
    [fetchCompanyDetailReq]
  )

  // 输入值时延迟触发
  const onSearch = useCallback(
    debounce((v) => {
      fetchFuzzySearchReq({
        orgName: v
      })
    }, 600),
    [fetchFuzzySearchReq]
  )

  const extra1 = (
    <span style={{ color: 'rgba(208, 2, 27, 1)' }}>
      企业不存在无法发起申请，
      <Link to="/msEnterprise/company/add">去添加</Link>
    </span>
  )

  const extra2 = (id) => (
    <span style={{ color: 'rgba(208, 2, 27, 1)' }}>
      企业必要信息缺失无法发起申请,
      <Link to={`/msEnterprise/company/edit/${id}`}>去完善</Link>
    </span>
  )

  return {
    bankAccountList,
    companyDetail,
    setCompanyDetail: setData,
    setBankAccount: setList,
    fetchCompanyDetailReq,
    loading,
    props: {
      dataSource,
      extra,
      onSearch,
      onSelect
    }
  }
}

export default useSearchCompanyForApply
