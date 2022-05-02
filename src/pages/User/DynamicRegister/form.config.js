import React,{useState} from 'react'
import { Input, Row, Col, Select } from 'antd'
import CountDown, { useCountDown } from '@/components/CountDown'
import { IDCardReg, PhoneReg, VerifyCodeReg, PasswordReg, BankCodeReg } from '@/common/reg'
import useSearchCompany from '@/hooks/useSearchCompany'
import { useBool, useRequest } from '@dragon/hooks'
import { InputPrice } from '@/components/FormItems'
import { getOrgType } from '@/services/common'
import { useSelector } from 'react-redux'

// 企业的配置
export const useCompanyConfig = (form) => {
  const { setFieldsValue } = form

  const { data: orgType = [] } = useRequest(() => getOrgType({ prodCode: 'saas' }), {
    enhanceResponse: (r) => r.slice(1)
  })

  const [cmyType, setCmyType] = useState(true)
  const [capitalDisabled, { toggle: toggleCapital }] = useBool(true)
  const [orgTypeDisabled, { toggle: toggleOrgType }] = useBool(true)
  const [addressDisabled, { toggle: toggleAddress }] = useBool(true)
  const [scopeDisabled, { toggle: toggleScope }] = useBool(true)

  // 模糊搜索企业名称
  const { props: selectProps } = useSearchCompany({
    onSearchSuccess: (data) => {
      // 若注册资本、公司地址、经营范围企查查中读取不到，则输入框允许用户自行输入
      toggleCapital(!!data.capital)
      toggleAddress(!!data.cmyOrgCode)
      toggleScope(!!data.scope)
      toggleOrgType(!!data.orgType)

      setFieldsValue({
        socialCreditCode: data.companySocialcreditCode,
        orgType: data.orgType,
        scope: data.scope,
        capital: data.capital,
        cmyOrgCode: data.cmyOrgCode,
        legalPersonName: data.companyLegalerName
      })
    }
  })

  const changeType = (v) => {
    if (v === '0') setCmyType(false)
    else setCmyType(true)
  }

  return [
    {
      itemProps: { label: '企业全称' },
      condition: {
        required: true,
        name: '企业全称',
        length: { min: 1, max: 50 }
      },
      name: 'orgName', // 字段名
      // children: <Input placeholder="请输入"/>
      children: <Select combobox placeholder="请输入" {...selectProps} />
    },
    {
      itemProps: { label: '所属行业' },
      rules: [{ required: true, message: '请选择所属行业' }],
      name: 'orgType',
      children: (
        <Select disabled={orgTypeDisabled}>
          {orgType.map((i) => (
            <Select.Option key={i.id} value={i.dictValue}>
              {i.dictValue}
            </Select.Option>
          ))}
        </Select>
      )
    },
    // {
    //   itemProps: { label: '注册资本' },
    //   condition: {
    //     whitespace: false,
    //     required: true,
    //     name: '注册资本'
    //   },
    //   name: 'capital',
    //   children: <InputPrice disabled={capitalDisabled} />
    // },
    {
      itemProps: { label: '组织机构代码' },
      condition: {
        required: true,
        name: '组织机构代码'
      },
      name: 'cmyOrgCode',
      children: <Input disabled={addressDisabled} />
    },
    {
      itemProps: { label: '统一社会信用代码' },
      condition: {
        required: true,
        name: '请输入统一社会信用代码'
      },
      name: 'socialCreditCode',
      children: <Input placeholder="请输入"/>
      // children: <Input disabled />
    },
    // {
    //   itemProps: { label: '经营范围' },
    //   condition: {
    //     required: true,
    //     name: '经营范围'
    //   },
    //   name: 'scope',
    //   children: <Input disabled={scopeDisabled} />
    // },
    {
      itemProps: { label: '法人姓名' },
      condition: { required: false, type: 'select' },
      name: 'legalPersonName',
      children: <Input placeholder="请输入"/>
      // children: <Input disabled />
    },
    {
      itemProps: { label: '法人身份证号' },
      condition: {
        required: false,
        name: '法人身份证号',
        regex: { regex: IDCardReg }
      },
      name: 'legalPersonIdCard',
      children: <Input placeholder="请输入" />
    },
    // {
    //   itemProps: { label: '法人手机号' },
    //   condition: {
    //     required: true,
    //     // name: '法人手机号',
    //     regex: { regex: PhoneReg }
    //   },
    //   name: 'legalPersonPhone',
    //   children: <Input placeholder="请输入" />
    // },
    // {
    //   itemProps: { label: '法人是否是实控人' },
    //   rules: [{ required: true, message: '请选择' }],
    //   name: 'cmyType',
    //   children: (
    //     <Select placeholder="请选择" onChange={changeType}>
    //       <Select.Option key={'0'} value={'0'}>
    //         是
    //       </Select.Option>
    //       <Select.Option key={'1'} value={'1'}>
    //         否
    //       </Select.Option>
    //     </Select>
    //   )
    // },
  ]
}

// 管理员的配置
export const useAdminConfig = (form) => {
  const { getFieldValue } = form

  // 检查时候密码一致
  const checkConfirm = (rule, value, callback) => {
    if (value && value !== getFieldValue('orgAdminPassword')) {
      callback('两次输入的密码不匹配')
    } else {
      callback()
    }
  }

  const { loading: sending, send } = useCountDown('register', {
    form,
    validateFieldsName: 'orgAdminPhone'
  })

  return [
    {
      itemProps: { label: '管理员姓名' },
      condition: {
        required: true,
        name: '姓名',
        length: { min: 1, max: 10 }
      },
      name: 'orgAdminName',
      children: <Input placeholder="请输入" />
    },
    // {
    //   itemProps: { label: '身份证号' },
    //   condition: {
    //     required: true,
    //     name: '身份证号',
    //     regex: { regex: IDCardReg }
    //   },
    //   name: 'orgAdminIdCard',
    //   children: <Input placeholder="请输入" />
    // },
    {
      itemProps: { label: '手机号' },
      condition: {
        required: true,
        name: '手机号',
        regex: { regex: PhoneReg }
      },
      name: 'orgAdminPhone',
      children: <Input placeholder="请输入" />
    },
    {
      itemProps: { label: '设置密码' },
      condition: {
        whitespace: false,
        required: true,
        name: '密码',
        regex: { regex: PasswordReg, msg: '数字、字母、符号组合，至少包含其中两种字符类型' }
      },
      name: 'orgAdminPassword',
      children: <Input type="password" placeholder="请输入" />
    },
    {
      itemProps: { label: '确认密码' },
      rules: [
        {
          required: true,
          message: '请输入密码'
        },
        { validator: checkConfirm }
      ],
      name: 'orgAdminPasswordConfirm',
      children: <Input type="password" placeholder="请输入" />
    },
    // {
    //   itemProps: { label: '验证码' },
    //   condition: {
    //     required: true,
    //     name: '验证码',
    //     regex: { regex: VerifyCodeReg }
    //   },
    //   name: 'verifyCode',
    //   children: (
    //     <Row gutter={18}>
    //       <Col span={16}>
    //         <Input placeholder="请输入" />
    //       </Col>
    //       <Col span={8}>
    //         <CountDown loading={sending} action={send} />
    //       </Col>
    //     </Row>
    //   )
    // }
  ]
}
