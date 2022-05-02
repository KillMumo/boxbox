import React, { useCallback, useEffect } from 'react'
import { Form, Select, Input, Row, Col } from 'antd'
import ModalForm from '@/components/ModalForm'
import { TextArea, DatePicker } from '@/components/FormItems'
import Upload from '@/components/Upload'
import { useRequest } from '@dragon/hooks'
import { fetchBankList } from '@/services/common'
import { formatMoney } from '@/utils'
import fieldValidator, { validateFiles } from '@/utils/fieldValidator'
import { BankCodeReg, bankStreamReg } from '@/common/reg'
import moment from 'moment'
import UploadButton from '../UploadButton'
import { getAccount, getBankAccountDetail } from '@/services/microSubsidy/finance'
import router from 'umi/router'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
  colon: false
}

// 还款
const PassAndReject = (props) => {
  const {
    info,
    form: { getFieldDecorator, setFieldsValue },
    payAmount,
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
        payBackBank: data.openBank,
        payBackProvince: data.openProvince,
        payBackCity: data.openCity,
        payBackBankBranch: data.openSubBranch
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
    <ModalForm form={props.form} {...restProps}>
      <Form {...formLayout}>
        <Form.Item
          label="还款账号"
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
          {getFieldDecorator('payBackAccount', {
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
          {getFieldDecorator('payBackBank', {
            initialValue: info?.extra?.applyBankSiteName,
            rules: [{ required: true, message: '请选择开户银行' }]
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item required label="开户省市" style={{ marginBottom: 0 }}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item>
                {getFieldDecorator('payBackProvince', {
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
                {getFieldDecorator('payBackCity', {
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
          {getFieldDecorator('payBackBankBranch', {
            initialValue: info?.extra?.applyBankBranch,
            rules: [
              {
                required: true,
                message: '请选择所属支行'
              }
            ]
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="还款本金(元)">
          {getFieldDecorator('payBackNum', {
            initialValue: formatMoney(payAmount)
          })(<span>{formatMoney(payAmount)}</span>)}
        </Form.Item>
        <Form.Item label="银行流水号">
          {getFieldDecorator('bankStream', {
            rules: [
              {
                validator: fieldValidator,
                regex: {
                  regex: bankStreamReg,
                  msg: '请输入正确的银行流水号'
                }
              }
            ]
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="实际还款日">
          {getFieldDecorator('actualPayBackDate', {
            rules: [{ required: true, message: '请选择实际还款日' }]
          })(<DatePicker disabledDate={(c) => c >= moment().endOf('day')} placeholder="请选择" />)}
        </Form.Item>
        <Form.Item label="上传材料">
          {getFieldDecorator('files', {
            rules: [{ validator: validateFiles }]
          })(
            <Upload
              length={10}
              size={20}
              extra="请上传相应还款材料"
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

export default Form.create()(PassAndReject)
