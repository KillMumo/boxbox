import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Input, Button, Select } from 'antd'
import { getSelectData } from '@/services/carbon/common'

//enterprise：是否显示企业查询框 类型为布尔值
//industry： 是否显示行业查询栏 类型为布尔值
//street： 是否显示街道查询栏 类型为布尔值
//year： 是否显示年份查询栏 类型为布尔值

const SearchForm = ({
  enterprise = false,
  industry = false,
  street = false,
  year = false,
  ...props
}) => {
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue }
  } = props

  const { Option } = Select

  //用来暂时存储后端返回的数据
  let yeardata2 = []
  let industrydata2 = []
  let streetdata2 = []

  //下拉框数据
  const [industryData, industrychange] = useState([])
  const [streetData, streetchange] = useState([])
  const [yearData, yearchange] = useState([])

  //展示input框和下拉框
  const getFields = () => {
    const children = []
    if (enterprise == true) {
      children.push(
        <Col span={8}>
          <Row type="flex" justify="center">
            <Col span={6}>
              <span>企业名称</span>
            </Col>
            <Col span={18}>{getFieldDecorator('enterprise')(<Input placeholder="请输入" />)}</Col>
          </Row>
        </Col>
      )
    }
    if (street == true) {
      children.push(
        <Col span={8}>
          <Row>
            <Col span={6}>
              <span>街道</span>
            </Col>
            <Col span={18}>
              {getFieldDecorator('street')(
                <Select placeholder="请选择" onChange={onChange}>
                  {streetData}
                </Select>
              )}
            </Col>
          </Row>
        </Col>
      )
    }
    if (industry == true) {
      children.push(
        <Col span={8}>
          <Row>
            <Col span={6}>
              <span>行业</span>
            </Col>
            <Col span={18}>
              {getFieldDecorator('trade')(<Select placeholder="请选择">{industryData}</Select>)}
            </Col>
          </Row>
        </Col>
      )
    }

    if (year == true) {
      children.push(
        <Col span={8}>
          <Row>
            <Col span={6}>
              <span>年份</span>
            </Col>
            <Col span={18}>
              {getFieldDecorator('year')(<Select placeholder="请选择">{yearData}</Select>)}
            </Col>
          </Row>
        </Col>
      )
    }
    //console.log(children)
    return children
  }

  //选中街道时
  const onChange = (value) => {
    getSelectData().then((res) => {})
    console.log('select' + value)
  }

  //重置
  const handlereset = () => {
    resetFields()
  }

  //查询
  const search = () => {
    let result = getFieldsValue()
    console.log(result)
  }

  useEffect(() => {
    getSelectData().then((res) => {
      for (let i = 0; i < res.year.length; i++) {
        yeardata2.push(
          <Option key={'year' + i} value={res.year[i]}>
            {res.year[i]}
          </Option>
        )
      }
      yearchange(yeardata2)
      for (let i = 0; i < res.district.length; i++) {
        streetdata2.push(
          <Option key={i} value={res.district[i]}>
            {res.district[i]}
          </Option>
        )
      }
      streetchange(streetdata2)
      for (let i = 0; i < res.industry.length; i++) {
        industrydata2.push(
          <Option key={'industry' + i} value={res.industry[i]}>
            {res.industry[i]}
          </Option>
        )
      }
      industrychange(industrydata2)
    })
  }, [industrydata2, streetdata2, yeardata2])

  return (
    <Form className="ant-advanced-search-form">
      <Row gutter={[24, 24]}>
        {getFields()}
        <Col push={2} span={8}>
          <Button type="primary" htmlType="submit" onClick={search}>
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handlereset}>
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
export default Form.create()(SearchForm)
