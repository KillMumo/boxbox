import React, { useCallback } from 'react'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import { Form, Row, Select, Col, Button, message } from 'antd'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'
import {
  getCompanyDetail,
  fetchRelationOption,
  fetchRelationList,
  setRelation
} from '@/services/platform'
import { CompanyTypeRelative } from '@/common/map'
import router from 'umi/router'
import useDict from '@/hooks/useDict'

const formLayout = {
  colon: false,
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 15
  }
}

const formLayoutWithoutLabel = {
  wrapperCol: {
    offset: 6,
    span: 15
  }
}

const SetRole = (props) => {
  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator, validateFields, getFieldValue }
  } = props

  const orgType = useDict('org_type')

  const { loading: typeListLoading, data: orgList = [] } = useRequest(() => fetchRelationOption())

  const { loading: getDetailLoading, data = {} } = useRequest(() => getCompanyDetail(id))

  const {
    loading: relationOrgLoading,
    data: relationList = [],
    start: fetchRelationListReq
  } = useRequest(fetchRelationList, { manual: true })

  const { loading: submitLoading, start: setRelatedReq } = useRequest(setRelation, {
    manual: true,
    onSuccess: () => {
      message.success('设置成功')
      router.push('/platform/setRole')
    }
  })

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          const relatedOrgId = getFieldValue('relatedOrgId')
          console.log(relatedOrgId)
          const relatedOrgName = relationList.find((i) => i.id === relatedOrgId)?.orgName
          const params = {
            ...values,
            orgId: id,
            orgName: data.orgName,
            relatedOrgName
          }
          setRelatedReq(params)
        }
      })
    },
    [data.orgName, getFieldValue, id, relationList, setRelatedReq, validateFields]
  )

  return (
    <Card transparent loading={getDetailLoading}>
      <Card>
        <DescriptionList border={false}>
          <DescriptionList.Description label="企业名称">{data.orgName}</DescriptionList.Description>
          <DescriptionList.Description label="企业类型">
            {orgType[data.orgType]}
          </DescriptionList.Description>
          <DescriptionList.Description label="管理员">{data.admin}</DescriptionList.Description>
          <DescriptionList.Description label="联系方式">
            {data.adminPhone}
          </DescriptionList.Description>
        </DescriptionList>
      </Card>
      <Card title="角色设置">
        <Form {...formLayout} onSubmit={handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="企业类型">
                {getFieldDecorator('scmType', {
                  rules: [{ required: true, message: '请选择企业类型' }]
                })(
                  <Select
                    onChange={(v) => fetchRelationListReq({ scmType: v })}
                    loading={typeListLoading}
                  >
                    {orgList
                      .filter((i) => i.dictKey !== '0')
                      .map((i) => (
                        <Select.Option
                          key={i.dictKey}
                          value={CompanyTypeRelative.enum[i.dictValue]}
                        >
                          {i.dictValue}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="关联企业">
                {getFieldDecorator('relatedOrgId', {
                  rules: [{ required: true, message: '请选择关联企业' }]
                })(
                  <Select loading={relationOrgLoading}>
                    {relationList.map((i) => (
                      <Select.Option key={i.id} value={i.id}>
                        {i.orgName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item {...formLayoutWithoutLabel}>
                <ButtonGroup>
                  <Button>返回</Button>
                  <Button loading={submitLoading} type="primary" htmlType="submit">
                    确认设置
                  </Button>
                </ButtonGroup>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Card>
  )
}

export default Form.create()(SetRole)
