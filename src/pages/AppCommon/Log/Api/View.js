import React from 'react'
import { getLogApiDetail } from '@/services/log'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import { useRequest } from '@dragon/hooks'

const Description = DescriptionList.Description
const Review = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const { loading, data: info = {} } = useRequest(() => getLogApiDetail(id))

  return (
    <Card loading={loading}>
      <DescriptionList>
        <Description label="服务id">{info.serviceId}</Description>
        <Description label="软件环境">{info.env}</Description>
        <Description label="服务host">{info.serverHost}</Description>
        <Description label="服务ip">{info.serverIp}</Description>
        <Description label="日志名">{info.methodDes}</Description>
        <Description label="客户ip">{info.userIp}</Description>
        <Description label="请求方法">{info.requestMethod}</Description>
        <Description label="请求地址">{info.requestUri}</Description>
        <Description label="方法类">{info.execClass}</Description>
        <Description label="方法名">{info.execMethod}</Description>
        <Description label="请求人">{info.userName}</Description>
        <Description label="请求时间">{info.requestTime}</Description>
        <Description label="请求数据">{info.requestParams}</Description>
        <Description label="请求耗时">{info.execTime}</Description>
      </DescriptionList>
    </Card>
  )
}

export default Review
