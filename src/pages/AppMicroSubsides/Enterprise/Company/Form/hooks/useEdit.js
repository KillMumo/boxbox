import { useState, useEffect } from 'react'
import { message } from 'antd'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'
import { updateCompany, fetchDetail } from '@/services/microSubsidy/enterprise'
import { formatValues, decode } from '../store'

const useEdit = ({ id, setList, form, toggle }) => {
  const { validateFieldsAndScroll, setFieldsValue } = form

  // 解码之后的数据
  const [initialValue, setInitialValue] = useState({})

  // 获取详情
  const { loading, data = {}, start: fetchDetailReq } = useRequest(() => fetchDetail(id), {
    manual: true,
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

      // 设置动态表单的长度
      setList(res)
    }
  })
  useEffect(() => {
    if (id) fetchDetailReq()
  }, [fetchDetailReq, id])

  // 提交的请求
  const { loading: submitting, start: submitReq } = useRequest(updateCompany, {
    manual: true,
    onSuccess: (res) => {
      message.success('更新成功')
      router.push(`/msEnterprise/company/view/${id}`)
    }
  })

  // 提交的方法
  const handleSubmit = (e) => {
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = formatValues(values)
        submitReq({ id, ...params, admin: { id: data.admin?.id, ...params.admin } })
      }
    })
  }

  return {
    loading,
    submitting,
    handleSubmit,
    initialValue,
    data
  }
}

export default useEdit
