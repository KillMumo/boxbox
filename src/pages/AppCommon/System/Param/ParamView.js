import React from 'react'
import { getParamDetail } from '@/services/param'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'
import DescriptionList from '@/components/DescriptionList'
import Card from '@/components/Card'

const Description = DescriptionList.Description
const ParamView = (props) => {
  const {
    params: { id }
  } = props.match

  const { loading: getDetailLoading, data: info = {} } = useRequest(() => getParamDetail(id), [id])

  //Card及DescriptionList组件示例
  return (
    <Card loading={getDetailLoading}>
      <DescriptionList>
        <Description label="参数名称">{info.paramName}</Description>
        <Description label="参数键名">{info.paramKey}</Description>
        <Description label="参数键值">{info.paramValue}</Description>
        {/*占据整行*/}
        <Description label="参数描述" whole>
          {info.remark}
        </Description>
      </DescriptionList>
      <ButtonGroup align="center">
        <Button type="primary">
          <Link to={`/system/param/edit/${info.id}`}>编辑</Link>
        </Button>
        <Button>
          <Link to={`/system/param`}>返回</Link>
        </Button>
      </ButtonGroup>
    </Card>
  )
}

export default ParamView
