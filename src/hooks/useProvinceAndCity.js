import { useRequest } from '@dragon/hooks'
import { fetchProvince, fetchCity } from '@/services/common'
import { useCallback } from 'react'

const useProvinceAndCity = (form, options = {}) => {
  const { setFieldsValue } = form
  const { cityLabel = 'city', onFetchCitySuccess = () => {}, onCitySelect = () => {} } = options

  // 省份列表
  const { loading: provinceLoading, data: provinceList = [] } = useRequest(fetchProvince)

  // 获取市
  const { loading: cityLoading, data: cityList = [], start: fetchCityReq } = useRequest(fetchCity, {
    manual: true,
    onSuccess: (res) => {
      setFieldsValue({
        [cityLabel]: void 0
      })
      onFetchCitySuccess(res)
    }
  })

  // 选择省份查城市
  const handleProvinceChange = useCallback(
    (v, { key }) => {
      fetchCityReq({ provinceCode: key })
    },
    [fetchCityReq]
  )

  return {
    provinceList,
    provinceProps: {
      loading: provinceLoading,
      onChange: handleProvinceChange
    },
    cityList,
    cityProps: {
      loading: cityLoading,
      onSelect: onCitySelect
    }
  }
}

export default useProvinceAndCity
