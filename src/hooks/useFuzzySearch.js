import { useRequest, usePersistFn } from '@dragon/hooks'
import { useCallback, useMemo } from 'react'
import debounce from 'lodash/debounce'
import { Select } from 'antd'
import React from 'react'
import { fetchCompanyInfo, fetchCompanyDetail } from '@/services/register'

/**
 * 模糊搜索，和Select搭配用
 * @param {点击查询详情成功的回调} onSearchSuccess
 * @param {true/false 代表是否启用搜索详情功能} disableSelectSearch
 * @param {用来代替默认企查查模糊搜索的接口方法} fuzzyFn
 * @param {用来代替默认企查查查详情的接口方法} detailFn
 * @param {选中后的回调，自带查详情，可使用disableSelectSearch禁用} onSelect
 * @param {list的key} keyPropName
 * @param {list的value} valuePropName
 */
const useFuzzySearch = (options = {}) => {
  const {
    onSearchSuccess = (res) => {},
    disableSelectSearch = false,
    fuzzyFn,
    detailFn,
    onSelect: innerOnSelect = () => {},
    keyPropName = 'keyNo',
    valuePropName = 'orgName'
  } = options

  // 遍历成select
  const map = usePersistFn((i) => (
    <Select.Option key={i[keyPropName]} value={i[valuePropName]}>
      {i[valuePropName]}
    </Select.Option>
  ))

  const innerSelectPersisted = usePersistFn(innerOnSelect)

  // 模糊搜索
  const { data: children = [], loading, start: fetchCompanyReq } = useRequest(
    fuzzyFn ? fuzzyFn : fetchCompanyInfo,
    {
      manual: true,
      enhanceResponse: (res) => {
        if (res.records) {
          return res.records
        }
        return res
      }
    }
  )

  // 模糊搜索选中查询详情
  const { start: fetchCompanyDetailReq } = useRequest(detailFn ? detailFn : fetchCompanyDetail, {
    manual: true,
    onSuccess: onSearchSuccess
  })

  // 选中时触发查询详情
  const onSelect = useCallback(
    (v, c) => {
      const { key } = c
      const checked = children.find((i) => {
        if (i[keyPropName]) {
          return `${i[keyPropName]}` === key
        } else {
          return i === v
        }
      })
      // 把onSelect的参数和选中的item都暴露出去
      innerSelectPersisted(v, c, checked)
      if (!disableSelectSearch) {
        fetchCompanyDetailReq({ keyNo: key, orgName: v })
      }
    },
    [children, disableSelectSearch, fetchCompanyDetailReq, innerSelectPersisted, keyPropName]
  )

  // 输入值时延迟触发
  const onSearch = useMemo(
    () =>
      debounce((v, c) => {
        if (children[0]) {
          innerOnSelect(children[0].orgName, children.map(map)[0])
        }
        fetchCompanyReq({
          orgName: v
        })
      }, 600),
    [children, fetchCompanyReq, innerOnSelect, map]
  )

  return {
    props: {
      allowClear: true,
      loading,
      showSearch: true,
      children: children.map(map),
      onSearch,
      onSelect,
      filterOption: false
    }
  }
}

export default useFuzzySearch
