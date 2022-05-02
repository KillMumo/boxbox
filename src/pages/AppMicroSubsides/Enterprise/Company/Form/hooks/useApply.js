import { useRequest } from '@dragon/hooks'
import { message } from 'antd'
import router from 'umi/router'
import { addCompany } from '@/services/microSubsidy/enterprise'
import { formatValues } from '../store'

const useApply = (form) => {
  const { validateFieldsAndScroll } = form

  const { loading, start: submitReq } = useRequest(addCompany, {
    manual: true,
    onSuccess: (res) => {
      message.success('添加成功')
      router.push('/msEnterprise/company')
    }
  })

  // 提交的方法
  const handleSubmit = (e) => {
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = formatValues(values)
        submitReq(params)
      }
    })
  }

  return {
    loading,
    handleSubmit
  }
}

export default useApply
