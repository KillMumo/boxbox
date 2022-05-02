import React from 'react'
import { searchUrl } from '@/common/map'
import { isRegistered } from '@/services/microSubsidy/enterprise'
import { useSelector } from 'react-redux'
import { windowOpen } from '@/utils'

// 企业名称和姓名的description
const DescriptionCompany = ({ data, type, orgName }) => {
  const codes = useSelector(({ authorities }) => authorities.button.buttons)
  const handleClick = async () => {
    //如果类型是企业名称，查询企业是否为本平台企业
    if (type === 'company') {
      const res = await isRegistered({ orgName: data })
      // 如果返回-1，则不是本平台企业，跳转到天眼查
      if (res === -1) {
        windowOpen(searchUrl[type] + data)
      }
      // 否则，跳转到企业详情页
      else {
        windowOpen(`/msEnterprise/company/view/${res}`)
      }
    }
    // 否则，类型为人名，跳转到天眼查
    else {
      windowOpen(searchUrl[type] + data)
    }
  }

  return data ? (
    codes.includes('企业管理-详情页-跳转-国投') && orgName !== data ? (
      <a onClick={handleClick}>{data}</a>
    ) : (
      data
    )
  ) : (
    '-'
  )
}

export default DescriptionCompany
