import React, { useEffect, useState } from 'react'
import { Input, Row, Col, Radio, Select } from 'antd'
import CountDown, { useCountDown } from '@/components/CountDown'
import { IDCardReg, PhoneReg, VerifyCodeReg, PasswordReg, BankCodeReg } from '@/common/reg'
import useSearchCompany from '@/hooks/useSearchCompany'
import useProvinceAndCityWithBank from '@/hooks/useProvinceAndCityWithBank'
import { RowLayout, ColLayout } from '@/utils/Form'
import { useBool, useRequest } from '@dragon/hooks'
import { InputPrice } from '@/components/FormItems'
import { getOrgType } from '@/services/common'
import { useSelector } from 'react-redux'

// 企业的配置
export const useCompanyConfig = (form, isUpdate) => {
  const { setFieldsValue, getFieldValue } = form

  const prodCode = useSelector(({ prodCode }) => prodCode)
  const { data: orgType = [] } = useRequest(() => getOrgType({ prodCode }), {
    enhanceResponse: (r) => r.slice(1)
  })

  const [capitalDisabled, { toggle: toggleCapital }] = useBool(true)
  const [orgTypeDisabled, { toggle: toggleOrgType }] = useBool(true)
  const [addressDisabled, { toggle: toggleAddress }] = useBool(true)
  const [scopeDisabled, { toggle: toggleScope }] = useBool(true)

  const [isControl, toggleIsControl] = useState(true)
  useEffect(() => {
    toggleIsControl(getFieldValue('isRealControlPerson') === 1)
  }, [getFieldValue])

  // 模糊搜索企业名称
  const { props: selectProps } = useSearchCompany({
    onSearchSuccess: (data) => {
      // 若注册资本、公司地址、经营范围企查查中读取不到，则输入框允许用户自行输入
      toggleCapital(!!data.capital)
      toggleAddress(!!data.address)
      toggleScope(!!data.scope)
      toggleOrgType(!!data.orgType)

      setFieldsValue({
        socialCreditCode: data.companySocialcreditCode,
        orgType: data.orgType,
        scope: data.scope,
        capital: data.capital,
        address: data.address,
        legalPersonName: data.companyLegalerName
      })
    }
  })

  return [
    {
      itemProps: { label: '企业全称' },
      condition: {
        required: true,
        name: '企业全称',
        length: { min: 1, max: 50 }
      },
      name: 'orgName', // 字段名
      children: <Select disabled={isUpdate} placeholder="请输入" {...selectProps} />
    },
    {
      itemProps: { label: '统一社会信用代码' },
      condition: {
        required: true,
        name: '请输入统一社会信用代码'
      },
      name: 'socialCreditCode',
      children: <Input disabled />
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
    {
      itemProps: { label: '注册资本' },
      condition: {
        required: true,
        name: '注册资本'
      },
      name: 'capital',
      children: <InputPrice disabled={capitalDisabled} />
    },
    {
      itemProps: { label: '公司地址' },
      condition: {
        required: true,
        name: '公司地址'
      },
      name: 'address',
      children: <Input disabled={addressDisabled} />
    },
    {
      itemProps: { label: '经营范围' },
      condition: {
        required: true,
        name: '经营范围'
      },
      name: 'scope',
      children: <Input disabled={scopeDisabled} />
    },
    {
      itemProps: { label: '法人姓名' },
      condition: {
        required: true,
        name: '法人姓名'
      },
      name: 'legalPersonName',
      children: <Input disabled />
    },
    {
      itemProps: { label: '法人身份证号' },
      condition: {
        required: true,
        name: '法人身份证号',
        regex: { regex: IDCardReg }
      },
      name: 'legalPersonIdCard',
      children: <Input disabled={isUpdate} placeholder="请输入" />
    },
    {
      itemProps: { label: '法人手机号' },
      condition: {
        required: true,
        name: '法人手机号',
        regex: { regex: PhoneReg }
      },
      name: 'legalPersonPhone',
      children: <Input disabled={isUpdate} placeholder="请输入" />
    },
    {
      itemProps: { label: '法人是否是实控人' },
      name: 'isRealControlPerson',
      children: (
        <Radio.Group onChange={(e) => toggleIsControl(e.target.value)}>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      )
    },
    {
      itemProps: { label: '实控人姓名' },
      condition: {
        required: true,
        name: '实控人姓名',
        length: { min: 1, max: 10 }
      },
      name: 'realControlPersonName',
      children: <Input placeholder="请输入" />,
      hidden: isControl
    },
    {
      itemProps: { label: '实控人身份证号' },
      condition: {
        required: true,
        name: '实控人身份证号',
        regex: { regex: IDCardReg }
      },
      name: 'realControlPersonIdCard',
      children: <Input placeholder="请输入" />,
      hidden: isControl
    },
    {
      itemProps: { label: '实控人手机号' },
      condition: {
        required: true,
        name: '实控人手机号',
        regex: { regex: PhoneReg }
      },
      name: 'realControlPersonPhone',
      children: <Input placeholder="请输入" />,
      hidden: isControl
    }
  ]
}

// 管理员的配置
export const useAdminConfig = (form, isUpdate) => {
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
      itemProps: { label: '姓名' },
      condition: {
        required: true,
        name: '姓名',
        length: { min: 1, max: 10 }
      },
      name: 'orgAdminName',
      children: <Input disabled={isUpdate} placeholder="请输入" />
    },
    {
      itemProps: { label: '身份证号' },
      condition: {
        required: true,
        name: '身份证号',
        regex: { regex: IDCardReg }
      },
      name: 'orgAdminIdCard',
      children: <Input disabled={isUpdate} placeholder="请输入" />
    },
    {
      itemProps: { label: '手机号' },
      condition: {
        required: true,
        name: '手机号',
        regex: { regex: PhoneReg }
      },
      name: 'orgAdminPhone',
      children: <Input disabled={isUpdate} placeholder="请输入" />
    },
    {
      itemProps: { label: '设置密码' },
      condition: {
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
    {
      itemProps: { label: '验证码' },
      condition: {
        required: true,
        name: '验证码',
        regex: { regex: VerifyCodeReg }
      },
      name: 'verifyCode',
      children: (
        <Row gutter={18}>
          <Col span={16}>
            <Input placeholder="验证码" />
          </Col>
          <Col span={8}>
            <CountDown loading={sending} action={send} />
          </Col>
        </Row>
      ),
      hidden: isUpdate
    }
  ]
}

// 银行的配置
export const useBankConfig = (form) => {
  // 省市银行支行
  const {
    provinceList,
    provinceProps,
    cityList,
    cityProps,
    bankList,
    bankProps,
    branchList,
    branchProps,
    isManual,
    toggleManual
  } = useProvinceAndCityWithBank(form, {
    bankLabel: 'bankSite'
  })

  return [
    {
      itemProps: { label: '开户银行' },
      name: 'bankSite',
      rules: [{ required: true, message: '请选择开户银行' }],
      children: (
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder="请选择"
          {...bankProps}
        >
          {bankList.map((i) => (
            <Select.Option key={i.bankCode} value={i.bankName}>
              {i.bankName}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      itemProps: { label: '银行账号' },
      condition: {
        required: true,
        name: '银行账号',
        length: { min: 1, max: 30 },
        regex: { regex: BankCodeReg }
      },
      name: 'bankAccountNumber',
      children: <Input placeholder="请输入" />
    },
    {
      id: 'damn', // id作为key
      itemProps: { label: '省市', required: true },
      layout: { container: RowLayout },
      children: [
        {
          name: 'bankProvince',
          layout: { container: ColLayout },
          rules: [{ required: true, message: '请选择省份' }],
          children: (
            <Select {...provinceProps} placeholder="请选择">
              {provinceList.map((p) => (
                <Select.Option value={p.provinceName} key={p.provinceCode}>
                  {p.provinceName}
                </Select.Option>
              ))}
            </Select>
          )
        },
        {
          name: 'bankCity',
          layout: { container: ColLayout },
          rules: [{ required: true, message: '请选择城市' }],
          children: (
            <Select {...cityProps} placeholder="请选择">
              {cityList.map((c) => (
                <Select.Option value={c.cityName} key={c.cityCode}>
                  {c.cityName}
                </Select.Option>
              ))}
            </Select>
          )
        }
      ]
    },
    {
      id: 'manual',
      itemProps: {
        label: '所属支行',
        extra: (
          <span>
            未找到所属支行？请<a onClick={() => toggleManual()}>自行填写</a>
          </span>
        )
      },
      rules: [{ required: true, message: '请选择所属支行' }],
      name: 'bankBranch',
      children: (
        <Select {...branchProps} placeholder="请选择">
          {branchList.map((i) => (
            <Select.Option key={i.bankBranchCode} value={i.bankBranchName}>
              {i.bankBranchName}
            </Select.Option>
          ))}
        </Select>
      ),
      hidden: isManual
    },
    {
      id: 'notManual',
      itemProps: {
        label: '所属支行',
        extra: (
          <span>
            未找到所属支行？请<a onClick={() => toggleManual()}>自行输入</a>
          </span>
        )
      },
      condition: {
        required: true,
        name: '所属支行',
        length: { min: 1, max: 30 }
      },
      name: 'bankBranch',
      children: <Input placeholder="请输入" />,
      hidden: !isManual
    }
  ]
}
