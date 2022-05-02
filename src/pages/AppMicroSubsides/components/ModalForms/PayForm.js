import React, { useEffect, useCallback } from 'react'
import { Form, Row, Col, Select, Input } from 'antd'
import moment from 'moment'
import ModalForm from '@/components/ModalForm'
import { TextArea, DatePicker, InputMoney } from '@/components/FormItems'
import Upload from '@/components/Upload'
import fieldValidator, { validateFiles } from '@/utils/fieldValidator'
import { amountReg, bankStreamReg, BankCodeReg } from '@/common/reg'
import { useRequest } from '@dragon/hooks'
import { getAccount, getBankAccountDetail } from '@/services/microSubsidy/finance'
import router from 'umi/router'
import { fetchBankList } from '@/services/common'
import UploadButton from '../UploadButton'

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
  colon: false
}

// 放款
const PayForm = (props) => {
  const {
    info,
    form: { getFieldDecorator, setFieldsValue },
    ...restProps
  } = props

  // 获取银行账号列表
  const { data: bankAccountList = [], start } = useRequest(getAccount, {
    manual: true
  })

  // 获取银行列表
  const { data: bankList = [] } = useRequest(fetchBankList)

  // 查询银行账号详情
  const { start: fetchAccountDetailReq } = useRequest(getBankAccountDetail, {
    manual: true,
    onSuccess: (data) => {
      setFieldsValue({
        bankSiteName: data.openBank,
        bankProvince: data.openProvince,
        bankCity: data.openCity,
        bankBranch: data.openSubBranch
      })
    }
  })

  // 银行账号选中时触发查询详情
  const onAccountSelect = useCallback(
    (v) => {
      fetchAccountDetailReq({ bankNum: v })
    },
    [fetchAccountDetailReq]
  )

  useEffect(() => {
    if (info?.extra?.orgName) {
      start({ orgName: info?.extra?.orgName })
    }
  }, [start, info])

  return (
    <ModalForm form={props.form} {...restProps} width="660px" bodystyle={{ overflow: 'scroll' }}>
      <Form {...formLayout}>
        <Form.Item
          label="放款账号"
          extra={
            <span>
              未找到银行账号？
              <a
                onClick={() => {
                  router.push(`/msEnterprise/company/edit/${info.extra.orgId}`)
                }}
              >
                去完善
              </a>
            </span>
          }
        >
          {getFieldDecorator('bankAccount', {
            initialValue: info?.extra?.applyBankAccount,
            rules: [
              {
                validator: fieldValidator,
                required: true,
                name: '银行账号',
                regex: {
                  regex: BankCodeReg,
                  msg: '请输入正确的银行账号'
                }
              }
            ]
          })(
            <Select placeholder="请选择" onSelect={onAccountSelect}>
              {bankAccountList.map((b) => (
                <Select.Option key={b.id} value={b.bankNumber}>
                  {b.bankNumber}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="开户银行">
          {getFieldDecorator('bankSiteName', {
            initialValue: info?.extra?.applyBankSiteName,
            rules: [{ required: true, message: '请选择开户银行' }]
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item required label="开户省市" style={{ marginBottom: 0 }}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item>
                {getFieldDecorator('bankProvince', {
                  initialValue: info?.extra?.applyBankProvince,
                  rules: [
                    {
                      required: true,
                      message: '请选择省份'
                    }
                  ]
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                {getFieldDecorator('bankCity', {
                  initialValue: info?.extra?.applyBankCity,
                  rules: [
                    {
                      required: true,
                      message: '请选择城市'
                    }
                  ]
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="所属支行">
          {getFieldDecorator('bankBranch', {
            initialValue: info?.extra?.applyBankBranch,
            rules: [
              {
                required: true,
                message: '请选择所属支行'
              }
            ]
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="放款银行">
          {getFieldDecorator('payBankName', {
            rules: [
              {
                validator: fieldValidator,
                required: true,
                name: '放款银行'
              }
            ]
          })(
            <Select
              showSearch
              placeholder="请选择"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {bankList.map((b) => (
                <Select.Option key={b.bankCode} value={b.bankName}>
                  {b.bankName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="放款金额(元)">
          {getFieldDecorator('payAmount', {
            rules: [
              {
                validator: fieldValidator,
                required: true,
                name: '放款金额',
                regex: {
                  regex: amountReg,
                  msg: '请输入正确的放款金额'
                },
                boundary: { min: 0, max: 100000000, msg: '请输入0-100000000内数字' }
              }
            ]
          })(<InputMoney placeholder="请输入" isBottom="true" />)}
        </Form.Item>
        <Form.Item label="放款时间">
          {getFieldDecorator('payDate', {
            rules: [{ required: true, message: '请选择放款时间' }]
          })(
            <DatePicker
              disabledDate={(c) => c >= moment().endOf('day')}
              style={{ width: '100%' }}
              placeholder="请选择"
            />
          )}
        </Form.Item>
        <Form.Item label="银行流水号">
          {getFieldDecorator('bankStream', {
            rules: [
              {
                validator: fieldValidator,
                regex: {
                  regex: bankStreamReg,
                  msg: '请输入正确的流水号'
                }
              }
            ]
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="约定还款日">
          {getFieldDecorator('appointDate', {
            rules: [{ required: true, message: '请选择约定还款日' }]
          })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
        </Form.Item>
        <Form.Item label="银行放款材料">
          {getFieldDecorator('files', {
            rules: [{ validator: validateFiles }]
          })(
            <Upload
              length={10}
              size={20}
              extra="请上传银行放款材料"
              accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
              listType="picture"
            >
              <UploadButton />
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('remark')(<TextArea placeholder="请输入" />)}
        </Form.Item>
      </Form>
    </ModalForm>
  )
}

export default Form.create()(PayForm)
