import React, { useCallback } from 'react'
import { Form, Row, Col, Input, Button, message, Select, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
import { fetchProvince, fetchCity, fetchBankList, fetchBranchBank } from '@/services/common'
import { addBankAccount } from '@/services/bank'
import { fetchState } from '@/common/store'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'
import Card from '@/components/Card'
import styles from './styles.less'
import WarnTip from '@/components/WarnTip'
import fieldValidator from '@/utils/fieldValidator'
import { BankCodeReg, SubBranch } from '@/common/reg'
import { useBoolean } from '@dragon/hooks'

const Option = Select.Option
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  colon: false
}

const doubleItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  },
  colon: false
}

const BankAdd = (props) => {
  const {
    form: { getFieldDecorator, validateFieldsAndScroll, resetFields, getFieldValue, setFieldsValue }
  } = props

  const accountName = fetchState('accountName') || null

  //是否展示省市选择框
  const { state: showProvinceAndCity, setTrue: show, setFalse: close } = useBoolean(true)
  //是否展示支行输入框
  const { state: showSubBranchInput, setTrue: showInput, setFalse: closeInput } = useBoolean(false)

  // 获取开户银行列表
  const { loading: bankListLoading, data: bankList = [] } = useRequest(fetchBankList, {
    enhanceResponse: (data) => {
      return data.concat({
        bankCode: '1000',
        bankName: '自行填写'
      })
    }
  })

  // 获取省份列表
  const { loading: provinceLoading, data: provinceList = [] } = useRequest(fetchProvince)

  // 获取支行列表
  const {
    loading: branchBankLoading,
    data: branchList = [],
    start: fetchBranchList
  } = useRequest(fetchBranchBank, { manual: true })

  // 获取城市列表
  const { loading: cityLoading, data: cityList = [], start: fetchCityReq } = useRequest(fetchCity, {
    manual: true,
    onSuccess: (res) => {
      setFieldsValue({
        bankCity: res[0].cityName
      })
      resetFields(['bankBranch'])
      const bankName = getFieldValue('bankSiteName')
      const bankCode = bankList.find((i) => i.bankName === bankName)?.bankCode
      bankCode && fetchBranchList({ bankCode, cityCode: res[0].cityCode })
    }
  })

  // 监听城市的选择
  const handleFetchBranch = useCallback(
    (_, { key: cityCode }) => {
      const bankName = getFieldValue('bankSiteName')
      const bankCode = bankList.find((i) => i.bankName === bankName)?.bankCode
      // 选择城市之后查支行
      bankCode && fetchBranchList({ bankCode, cityCode })
      // 重置表单中的支行
      resetFields(['bankBranch'])
    },
    [bankList, fetchBranchList, getFieldValue, resetFields]
  )

  //监听开户银行的选择
  const handleBankChange = useCallback(
    (_, { key: bankCode }) => {
      const cityName = getFieldValue('bankCity')
      const cityCode = cityList.find((i) => i.cityName === cityName)?.cityCode
      //如果选择“自行填写”，不展示省市选择框，展示自行输入框
      if (bankCode !== '1000') {
        cityCode && fetchBranchList({ bankCode, cityCode })
        // 重置表单中的支行
        resetFields(['bankBranch'])
        show()
        closeInput()
      } else {
        close()
        showInput()
      }
    },
    [cityList, fetchBranchList, getFieldValue, resetFields, close, closeInput, show, showInput]
  )

  //新增银行账户
  const { loading: addBankLoading, start: addBankReq } = useRequest(addBankAccount, {
    manual: true
  })

  //提交表单
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          addBankReq({ ...values, accountName }).then((res) => {
            if (res instanceof Error) return
            message.success('添加银行账户成功')
            router.push('/userCenter/bank')
          })
        }
      })
    },
    [validateFieldsAndScroll, addBankReq, accountName]
  )

  return (
    <Card>
      <Form className={styles.add} onSubmit={handleSubmit}>
        <Form.Item {...formItemLayout} label="银行账户名称">
          {getFieldDecorator('accountName')(
            <span>{accountName}</span> //{accountName}
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="银行账号">
          {getFieldDecorator('bankNumber', {
            rules: [
              {
                required: true,
                validator: fieldValidator,
                name: '银行账号',
                regex: {
                  // 正则校验
                  regex: BankCodeReg,
                  msg: '请输入正确的银行卡号'
                }
              }
            ]
          })(<Input placeholder="请输入银行账号" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="开户银行">
          {getFieldDecorator('bankSiteName', {
            rules: [
              {
                required: true,
                message: '请选择开户银行！'
              }
            ]
          })(
            <Select
              placeholder="请选择开户银行"
              loading={bankListLoading}
              onChange={handleBankChange}
            >
              {bankList.map((b) => (
                <Option key={b.bankCode} value={b.bankName}>
                  {b.bankName}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        {showProvinceAndCity ? (
          <Row>
            <Col span={8}>
              <Form.Item {...doubleItemLayout} label="开户省市">
                {getFieldDecorator('bankProvince', {
                  rules: [
                    {
                      required: true,
                      message: '请选择省份！'
                    }
                  ]
                })(
                  <Select
                    placeholder="请选择省份"
                    loading={provinceLoading}
                    onChange={(_, { key: v }) => fetchCityReq({ provinceCode: v })}
                  >
                    {provinceList.map((p) => (
                      <Option key={p.provinceCode} value={p.provinceName}>
                        {p.provinceName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6} style={{ paddingLeft: 5 }}>
              <Form.Item>
                {getFieldDecorator('bankCity', {
                  rules: [
                    {
                      required: true,
                      message: '请选择城市！'
                    }
                  ]
                })(
                  <Select
                    placeholder="请选择城市"
                    loading={cityLoading}
                    onSelect={handleFetchBranch}
                  >
                    {cityList.map((c) => (
                      <Option key={c.cityCode} value={c.cityName}>
                        {c.cityName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Form.Item {...formItemLayout} label="所属支行">
            {getFieldDecorator('bankBranch', {
              rules: [
                {
                  required: true,
                  validator: fieldValidator,
                  name: '所属支行',
                  regex: {
                    // 正则校验
                    regex: SubBranch,
                    msg: '所属支行名称首尾不能输入空格!'
                  },
                  length: {
                    // 长度校验，
                    min: 5,
                    max: 50,
                    msg: '所属支行名称在5-50之间！'
                  }
                }
              ]
            })(<Input placeholder="范例：上海银行股份有限公司上海静安支行" />)}
          </Form.Item>
        )}
        {showProvinceAndCity ? (
          showSubBranchInput ? (
            <Form.Item
              {...formItemLayout}
              label="所属支行"
              extra={WarnTip(
                <React.Fragment>
                  忘记支行名称？请
                  <span className={styles.showInput} onClick={closeInput}>
                    自行选择
                  </span>
                </React.Fragment>
              )}
            >
              {getFieldDecorator('bankBranch', {
                rules: [
                  {
                    required: true,
                    validator: fieldValidator,
                    name: '所属支行',
                    regex: {
                      // 正则校验
                      regex: SubBranch,
                      msg: '所属支行名称首尾不能输入空格!'
                    },
                    length: {
                      // 长度校验，
                      min: 5,
                      max: 50,
                      msg: '所属支行名称在5-50之间！'
                    }
                  }
                ]
              })(<Input placeholder="请填写所属支行" />)}
            </Form.Item>
          ) : (
            <Form.Item
              {...formItemLayout}
              label="所属支行"
              extra={WarnTip(
                <React.Fragment>
                  未找到所属支行？请
                  <span className={styles.showInput} onClick={showInput}>
                    自行填写
                  </span>
                </React.Fragment>
              )}
            >
              {getFieldDecorator('bankBranch', {
                rules: [{ required: true, message: '请选择支行名称！' }]
              })(
                <Select loading={branchBankLoading} placeholder="请选择所属支行">
                  {branchList.map((s) => (
                    <Option value={s.bankBranchName} key={s.bankBranchCode}>
                      <Tooltip placement="right" title={s.bankBranchName}>
                        <span>{s.bankBranchName}</span>
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )
        ) : null}
        <Row gutter={24}>
          <Col span={16}>
            <ButtonGroup align="center">
              <Button loading={addBankLoading} type="primary" htmlType="submit">
                提交
              </Button>
              <Button>
                <Link to="/userCenter/bank">返回</Link>
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default Form.create()(BankAdd)
