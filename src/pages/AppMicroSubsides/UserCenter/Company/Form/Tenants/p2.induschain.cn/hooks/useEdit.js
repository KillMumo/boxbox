import { useState } from 'react'
import { useRequest } from '@dragon/hooks'
import { message } from 'antd'
import router from 'umi/router'
import { decode } from '../store'
import { updateCompany, fetchDetail, addCompany } from '@/services/microSubsidy/enterprise'

const useEdit = ({ id, setList, form, toggle }) => {
  const { validateFieldsAndScroll, setFieldsValue } = form
  const [initialValue, setInitialValue] = useState({})

  // 获取详情
  const { loading, data = {} } = useRequest(() => fetchDetail(id), {
    onSuccess: (res) => {
      toggle(res.dataSource === 0 ? true : false)
      setFieldsValue({ dataSource: res.dataSource })

      setInitialValue(
        decode({
          companyBasicInfo: res.companyBasicInfoVO,
          legalPerson: res.legalPersonVO,
          realControlPerson: res.realControlPerson,
          baseAccount: res.baseAccount,
          generalAccount: res.generalAccount,
          supplierSelf: res.supplierSelf,
          clientSelf: res.clientSelf,
          supplierOther: res.supplierOther,
          clientOther: res.clientOther,
          parent: res.parent,
          mate: res.mate,
          children: res.children,
          admin: res.admin
        })
      )
      setList(res)
    }
  })

  // 提交的请求
  const { loading: submitting, start: submitReq } = useRequest(addCompany, {
    manual: true,
    onSuccess: (res) => {
      message.success('更新成功')
      router.push('/msUserCenter/companyInfo')
    }
  })

  // 提交的方法
  const handleSubmit = (e) => {
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = formatValues(values)
        submitReq({
          id,
          ...params
          // admin: { id: data.admin.id, ...params.admin }
        })
      }
    })
  }

  return {
    submitting,
    loading,
    handleSubmit,
    initialValue,
    data
  }
}

export default useEdit

function formatValues(values) {
  Object.keys(values).forEach((key) => {
    if (key.includes('/')) {
      const arrayName = key.split('/')[1]
      if (values[arrayName]) {
        values[arrayName].push(values[key])
      } else {
        values[arrayName] = [values[key]]
      }
      delete values[key]
    }
  })

  return values
}
