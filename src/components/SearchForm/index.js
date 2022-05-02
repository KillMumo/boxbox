import React, { useEffect, useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, Select } from 'antd'
import { getSelectData } from '@/services/carbon/common'

const SearchForm = (props) => {
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue },
    show = {},
    defaultValue = {},
    search = () => null,
    myRef = null
  } = props

  const [yearList, setYearList] = useState([])
  const [districtList, setDistrictList] = useState([])
  const [industryList, setIndustryList] = useState([])

  const formLayout = {
    layout: 'horizontal',
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
  }

  const requestData = (params) => {
    getSelectData(params).then((res) => {
      setYearList(res.year || [])
      setDistrictList(res.district || [])
      setIndustryList(res.industry || [])
    })
  }

  //选中街道时
  const onDistrictChange = (value) => {
    requestData({ district: value }) // 重新请求数据
    resetFields(['industry']) // 重置选中的行业
  }

  //查询
  const searchData = () => {
    let result = getFieldsValue()
    search(result)
  }

  const handleReset = () => {
    resetFields()
    search()
  }

  const renderFormItem = (config) => {
    const { label, name, item = {} } = config
    let children = null

    switch (item.type) {
      case 'input': {
        children = <Input {...item.props} />
        break
      }
      case 'select': {
        children = (
          <Select {...item.props}>
            {(item.options || []).map((el) => {
              return (
                <Select.Option key={el} value={el}>
                  {el}
                </Select.Option>
              )
            })}
          </Select>
        )
        break
      }
      default: {
        children = <Input />
        break
      }
    }

    return (
      <Col span={8} key={label}>
        <Form.Item label={label}>
          {getFieldDecorator(name, {
            rules: [],
            initialValue: defaultValue[name]
          })(children)}
        </Form.Item>
      </Col>
    )
  }

  const renderForm = () => {
    const formConfigList = [
      {
        label: '企业',
        name: 'companyName',
        item: {
          type: 'input',
          props: {
            placeholder: '请输入'
          }
        }
      },
      // {
      //   label: '街道',
      //   name: 'district',
      //   item: {
      //     type: 'select',
      //     options: districtList,
      //     props: {
      //       placeholder: '请选择',
      //       onChange: onDistrictChange
      //     }
      //   }
      // },
      {
        label: '行业',
        name: 'industry',
        item: {
          type: 'select',
          options: industryList,
          props: {
            placeholder: '请选择'
          }
        }
      },
      {
        label: '年份',
        name: 'year',
        item: {
          type: 'select',
          options: yearList,
          props: {
            placeholder: '请选择'
          }
        }
      }
    ]

    return formConfigList
      .filter((config) => show[config.name]) // 控制子表单显示隐藏
      .map((config) => {
        return renderFormItem(config)
      })
  }

  useEffect(() => {
    requestData()
  }, [])

  useImperativeHandle(myRef, () => ({
    search: searchData
  }))

  return (
    <Form className="ant-advanced-search-form" {...formLayout}>
      <Row>
        {renderForm()}
        <Col span={8}>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Button type="primary" htmlType="submit" onClick={searchData}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

const SearchFormContainer = Form.create()(SearchForm)

// https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html
SearchFormContainer.propTypes = {
  form: PropTypes.any, // Form实例
  // 控制子表单的显示隐藏
  show: PropTypes.shape({
    companyName: PropTypes.bool, // 公司名称
    district: PropTypes.bool, // 街道
    industry: PropTypes.bool, // 行业
    year: PropTypes.bool // 年份
  }),
  defaultValue: PropTypes.shape({
    year: PropTypes.string
  }),
  search: (params) => null, // 查询函数
  myRef: PropTypes.any // ref
}

export default SearchFormContainer
