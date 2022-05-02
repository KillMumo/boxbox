import useProvinceAndCity from './useProvinceAndCity'
import { useRequest, useBool } from '@dragon/hooks'
import { fetchBankList, fetchBranchBank } from '@/services/common'
import { useCallback } from 'react'

// cityLabel: '', // city的表单label
// bankLabel: '', // 银行的表单label
// branchLabel: '' // 支行的表单label
const useProvinceAndCityWithBank = (form, options = {}) => {
  const { getFieldValue, setFieldsValue } = form
  const {
    cityLabel = 'bankCity',
    bankLabel = 'bankSiteName',
    branchLabel = 'bankBranch',
    provinceLabel = 'bankProvince'
  } = options

  const [isManual, { toggle }] = useBool()

  // 获取银行信息
  const { loading: bankListLoading, data: bankList = [] } = useRequest(fetchBankList)

  // 获取支行信息
  const { loading: branchBankLoading, data: branchList = [], start: fetchBranchList } = useRequest(
    fetchBranchBank,
    {
      manual: true,
      onSuccess: (res) => {
        setFieldsValue({
          [branchLabel]: void 0
        })
      }
    }
  )

  const provinceAndCity = useProvinceAndCity(form, {
    cityLabel,
    onCitySelect: (_, { key: cityCode }) => {
      const bankName = getFieldValue(bankLabel)
      const bankCode = bankList.find((i) => i.bankName === bankName)?.bankCode
      bankCode && fetchBranchList({ bankCode, cityCode })
    },
    onFetchCitySuccess: () => {
      // 重置城市和支行
      setFieldsValue({
        [cityLabel]: void 0,
        [branchLabel]: void 0
      })
    }
  })

  // 银行改变时触发
  const onBankChange = useCallback(
    (_, { key: bankCode }) => {
      // const { cityList } = provinceAndCity
      // const cityName = getFieldValue(cityLabel)
      // // 如果已经城市名，那就查支行
      // const cityCode = cityList.find((i) => i.cityName === cityName)?.cityCode
      // cityCode && fetchBranchList({ bankCode, cityCode })
      // 重置省市和支行
      setFieldsValue({
        [provinceLabel]: void 0,
        [cityLabel]: void 0,
        [branchLabel]: void 0
      })
    },
    [provinceLabel, cityLabel, setFieldsValue, branchLabel]
  )

  return {
    ...provinceAndCity,
    bankList,
    bankProps: {
      loading: bankListLoading,
      onChange: onBankChange
    },
    branchList,
    branchProps: {
      loading: isManual ? void 0 : branchBankLoading
    },
    isManual,
    toggleManual: toggle
  }
}

export default useProvinceAndCityWithBank
