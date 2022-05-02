import React, { useState, useEffect } from 'react'
import useSearchCompany from '@/hooks/useSearchCompany'
import { Select, Input, Radio, InputNumber } from 'antd'
import { useBool } from '@dragon/hooks'
import Upload from '@/components/Upload'
import useProvinceAndCityWithBank from '@/hooks/useProvinceAndCityWithBank'
import { RowLayout, ColLayout } from '@/utils/Form'
import useDict from '@/hooks/useDict'
import { fetchClickedDetail } from '@/services/microSubsidy/enterprise'
import { BankCodeReg, IDCardReg, PhoneReg } from '@/common/reg'
import { InputMoney, InputPrice } from '@/components/FormItems'
import { validateFiles, validateMonth } from '@/utils/fieldValidator'
import UploadButton from '../../../components/UploadButton'
// import DescriptionCompany from '../../../components/DescriptionCompany'

// 前缀
const renderName = (prefix, name) => `${prefix}.${name}`

// 基本信息配置
export const useBasicConfig = (form, initialValue = {}) => {
  const { setFieldsValue, getFieldValue } = form

  // 企业类型
  const orgType = useDict('org_type')

  const [orgTypeDisabled, { toggle: toggleOrgType }] = useBool(true)
  const [capitalDisabled, { toggle: toggleCapital }] = useBool(true)
  const [addressDisabled, { toggle: toggleAddress }] = useBool(true)
  const [scopeDisabled, { toggle: toggleScope }] = useBool(true)

  // 字段名
  const renderCompanyName = (name) => renderName('companyBasicInfo', name)
  const renderLegalName = (name) => renderName('legalPerson', name)
  const renderRealControlName = (name) => renderName('realControlPerson', name)

  // 企业全称模糊搜索
  const { props: selectProps } = useSearchCompany({
    asyncFunc: fetchClickedDetail,
    onSearchSuccess: (res) => {
      // 若注册资本、公司地址、经营范围企查查中读取不到，则输入框允许用户自行输入
      toggleCapital(!!res.capital)
      toggleAddress(!!res.address)
      toggleScope(!!res.scope)
      toggleOrgType(!!res.orgType)
      // 设置表单值
      setFieldsValue({
        [renderCompanyName('socialCreditCode')]: res.companySocialcreditCode,
        [renderCompanyName('orgType')]: res.orgType,
        [renderCompanyName('capital')]: res.capital,
        [renderCompanyName('scope')]: res.scope,
        [renderCompanyName('address')]: res.address,
        [renderLegalName('legalPersonName')]: res.companyLegalerName
      })
    }
  })

  const [isRealControl, toggleIsRealControl] = useState(true)
  useEffect(() => {
    toggleIsRealControl(getFieldValue(renderLegalName('isRealControlPerson')) === 1 ? true : false)
  }, [getFieldValue, initialValue])

  return [
    {
      itemProps: { label: '企业全称' },
      condition: {
        required: true,
        name: '企业全称'
      },
      name: renderCompanyName('orgName'),
      children: (
        <Select
          disabled={!!initialValue[renderCompanyName('orgName')]}
          placeholder="请输入"
          {...selectProps}
        />
      )
    },
    {
      itemProps: { label: '统一社会信用代码' },
      condition: {
        required: true,
        name: '统一社会信用代码'
      },
      name: renderCompanyName('socialCreditCode'),
      children: <Input disabled />
    },
    {
      itemProps: { label: '所属行业' },
      condition: {
        required: true,
        name: '所属行业'
      },
      name: renderCompanyName('orgType'),
      children: (
        <Select disabled={orgTypeDisabled}>
          {Object.keys(orgType).map((i) => (
            <Select.Option key={i} value={orgType[i]}>
              {orgType[i]}
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
      name: renderCompanyName('capital'),
      children: <InputPrice disabled={capitalDisabled} />
    },
    {
      itemProps: { label: '公司地址' },
      condition: {
        required: true,
        name: '公司地址'
      },
      name: renderCompanyName('address'),
      children: <Input disabled={addressDisabled} />
    },
    {
      itemProps: { label: '经营范围' },
      condition: {
        required: true,
        name: '经营范围'
      },
      name: renderCompanyName('scope'),
      children: <Input disabled={scopeDisabled} />
    },
    {
      itemProps: { label: '营业执照', wrapperCol: { span: 14 } },
      rules: [
        { required: true, message: '请上传企业营业执照正本、副本或复印件' },
        { validator: validateFiles }
      ],
      name: renderCompanyName('businessLicenseUrl'),
      validateTrigger: 'onChange',
      children: (
        <Upload
          {...getUploadProps('加盖公章的企业营业执照正本、副本或复印件', true)}
          accept="pdf,jpg,jpeg,png"
          length={1}
        />
      )
    },
    {
      itemProps: { label: '企业章程', wrapperCol: { span: 14 } },
      rules: [{ required: true, message: '请上传企业章程' }, { validator: validateFiles }],
      name: renderCompanyName('organizationRuleUrl'),
      validateTrigger: 'onChange',
      children: <Upload {...getUploadProps('加盖公章的企业章程', true)} />
    },
    {
      itemProps: { label: '法人姓名' },
      condition: {
        required: true,
        name: '法人姓名'
      },
      name: renderLegalName('legalPersonName'),
      children: <Input disabled />
    },
    {
      itemProps: { label: '法人身份证号' },
      condition: {
        required: true,
        name: '法人身份证号',
        regex: { regex: IDCardReg }
      },
      name: renderLegalName('legalPersonIdCard'),
      children: <Input placeholder="请输入" />
    },
    {
      itemProps: { label: '法人手机号' },
      condition: {
        required: true,
        name: '法人手机号',
        regex: { regex: PhoneReg }
      },
      name: renderLegalName('legalPersonPhone'),
      children: <Input placeholder="请输入" />
    },
    {
      itemProps: { label: '法人身份证复印件', wrapperCol: { span: 14 } },
      rules: [{ required: true, message: '请上传法人身份证复印件' }, { validator: validateFiles }],
      name: renderLegalName('legalPersonIdCardUrl'),
      validateTrigger: 'onChange',
      children: (
        <Upload
          {...getUploadProps('加盖公章的法人身份证复印件', true)}
          accept="pdf,jpg,jpeg,png"
          length={2}
        />
      )
    },
    {
      itemProps: { label: '法人是否是实控人' },
      name: renderLegalName('isRealControlPerson'),
      children: (
        <Radio.Group onChange={(e) => toggleIsRealControl(!!e.target.value)}>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      )
    },
    {
      itemProps: { label: '实控人姓名' },
      name: renderRealControlName('realControlPersonName'),
      condition: {
        required: true,
        name: '实控人姓名'
      },
      children: <Input placeholder="请输入" />,
      hidden: isRealControl
    },
    {
      itemProps: { label: '实控人身份证号' },
      condition: {
        required: true,
        name: '实控人身份证号',
        regex: { regex: IDCardReg }
      },
      name: renderRealControlName('realControlPersonIdCard'),
      children: <Input placeholder="请输入" />,
      hidden: isRealControl
    },
    {
      itemProps: { label: '实控人手机号' },
      condition: {
        required: true,
        name: '实控人手机号',
        regex: { regex: PhoneReg }
      },
      name: renderRealControlName('realControlPersonPhone'),
      children: <Input placeholder="请输入" />,
      hidden: isRealControl
    },
    {
      itemProps: { label: '实控人身份证复印件', wrapperCol: { span: 14 } },
      rules: [
        { required: true, message: '请上传实控人身份证复印件' },
        { validator: validateFiles }
      ],
      name: renderRealControlName('realControlPersonIdCardUrl'),
      validateTrigger: 'onChange',
      children: (
        <Upload
          {...getUploadProps('加盖公章的实控人身份证复印件', true)}
          accept="pdf,jpg,jpeg,png"
          length={2}
        />
      ),
      hidden: isRealControl
    }
  ]
}

// 银行信息配置 基本户
export const useBankConfig = (form) => {
  const renderConfigName = (name) => renderName('baseAccount', name)
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
    cityLabel: renderConfigName('openCity'),
    bankLabel: renderConfigName('openBank'),
    branchLabel: renderConfigName('openSubBranch')
  })

  return [
    {
      itemProps: { label: '开户银行' },
      rules: [{ required: true, message: '请选择开户银行' }],
      name: renderConfigName('openBank'),
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
        regex: { regex: BankCodeReg },
        name: '银行账号'
      },
      name: renderConfigName('bankNumber'),
      children: <Input placeholder="请输入" />
    },
    {
      id: 'damn', // id作为key
      itemProps: { label: '省市', required: true },
      layout: { container: RowLayout },
      children: [
        {
          name: renderConfigName('openProvince'),
          rules: [{ required: true, message: '请选择省份' }],
          layout: { container: ColLayout },
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
          name: renderConfigName('openCity'),
          rules: [{ required: true, message: '请选择城市' }],
          layout: { container: ColLayout },
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
      condition: {
        required: true,
        name: '所属支行'
      },
      name: renderConfigName('openSubBranch'),
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
      condition: {
        required: true,
        name: '所属支行'
      },
      itemProps: {
        label: '所属支行',
        extra: (
          <span>
            未找到所属支行？请<a onClick={() => toggleManual()}>自行输入</a>
          </span>
        )
      },
      name: renderConfigName('openSubBranch'),
      children: <Input placeholder="请输入" />,
      hidden: !isManual
    }
  ]
}

// 银行信息配置 一般户
export const useBankNormalConfig = (form, id) => {
  const renderConfigName = (name) => renderName(`${id}/generalAccount`, name)

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
    cityLabel: renderConfigName('openCity'),
    bankLabel: renderConfigName('openBank'),
    branchLabel: renderConfigName('openSubBranch')
  })

  return [
    {
      itemProps: { label: '开户银行' },
      name: renderConfigName('openBank'),
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
        regex: { regex: BankCodeReg }
      },
      name: renderConfigName('bankNumber'),
      children: <Input placeholder="请输入" />
    },
    {
      id: 'damn', // id作为key
      itemProps: { label: '省市', required: true },
      layout: { container: RowLayout },
      children: [
        {
          name: renderConfigName('openProvince'),
          rules: [{ required: true, message: '请选择省份' }],
          layout: { container: ColLayout },
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
          name: renderConfigName('openCity'),
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
      name: renderConfigName('openSubBranch'),
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
      rules: [{ required: true, message: '请输入所属支行' }],
      name: renderConfigName('openSubBranch'),
      children: <Input placeholder="请输入" />,
      hidden: !isManual
    }
  ]
}

// 供销关系（自主填写）
export const useRelationSelfConfig = (form, prefix) => {
  const renderConfigName = (name) => renderName(prefix, name)

  // 企业全称模糊搜索
  const { props: selectProps } = useSearchCompany({
    disableSelect: true
  })

  return [
    {
      itemProps: { label: '企业全称' },
      condition: {
        required: true,
        name: '企业全称'
      },
      name: renderConfigName('companyName'),
      children: <Select placeholder="请输入" {...selectProps} />
    },
    {
      itemProps: { label: '近一年交易金额(元)' },
      condition: {
        required: true,
        name: '近一年交易金额(元)',
        boundary: { max: 100000000 }
      },
      name: renderConfigName('lastTotalTrade'),
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '合作时长(月)' },
      rules: [{ required: true, message: '请输入合作时长' }, { validator: validateMonth }],
      name: renderConfigName('cooperationTime'),
      children: <InputNumber style={{ width: '100%' }} precision={0} />
    },
    {
      itemProps: { label: '购销合同', wrapperCol: { span: 14 } },
      name: renderConfigName('contractUrl'),
      rules: [
        { required: true, message: '请上传加盖公章的购销合同' },
        { validator: validateFiles }
      ],
      children: <Upload {...getUploadProps('加盖公章的购销合同', true)} />
    },
    {
      itemProps: { label: '发票', wrapperCol: { span: 14 } },
      name: renderConfigName('invoice'),
      rules: [{ required: true, message: '请上传发票' }, { validator: validateFiles }],
      children: <Upload {...getUploadProps('发票', true)} />
    },
    {
      itemProps: { label: '其它交易材料', wrapperCol: { span: 14 } },
      name: renderConfigName('tradeMaterials'),
      rules: [{ validator: validateFiles }],
      children: <Upload {...getUploadProps('其它交易材料')} />
    }
  ]
}

// 供销关系配置（官方）
export const useRelationOtherConfig = (form, prefix) => {
  const renderConfigName = (name) => renderName(prefix, name)

  return [
    {
      itemProps: { label: '企业全称' },
      name: renderConfigName('companyName'),
      children: <Input disabled />
    },
    {
      itemProps: { label: '近一年交易金额（元)' },
      name: renderConfigName('lastTotalTrade'),
      children: <Input disabled />
    },
    {
      itemProps: { label: '占比' },
      name: renderConfigName('proportion'),
      children: <Input disabled />
    }
  ]
}

// 家人配置
export const useFamilyConfig = (form, relation) => {
  const renderConfigName = (name) => renderName(relation, name)

  let select = []
  switch (relation) {
    case 'parent':
      select = ['实控人父母', '法人父母']
      break
    case 'mate':
      select = ['实控人配偶', '法人配偶']
      break
    case 'children':
      select = ['实控人子女', '法人子女']
      break
    default:
      break
  }

  // 企业全称模糊搜索
  const { props: selectProps } = useSearchCompany({
    disableSelect: true
  })

  return [
    {
      itemProps: { label: '姓名' },
      condition: {
        required: true,
        name: '姓名'
      },
      name: renderConfigName('name'),
      children: <Input placeholder="请输入" />
    },
    {
      itemProps: { label: '身份证号' },
      condition: {
        name: '身份证号',
        regex: { regex: IDCardReg }
      },
      name: renderConfigName('idCard'),
      children: <Input placeholder="请输入" />
    },
    {
      itemProps: { label: '手机号' },
      name: renderConfigName('phone'),
      condition: {
        name: '手机号',
        regex: { regex: PhoneReg }
      },
      children: <Input placeholder="请输入" />
    },
    {
      itemProps: { label: '关系' },
      rules: [{ required: true, message: '请选择关系' }],
      name: renderConfigName('relation'),
      children: (
        <Select select="请选择">
          {select.map((i) => (
            <Select.Option value={i} key={i}>
              {i}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      itemProps: { label: '关联企业' },
      name: renderConfigName('relatedCompany'),
      children: <Select allowClear placeholder="请输入" {...selectProps} />
    }
  ]
}

// 管理员配置
export const useAdminConfig = (form, initialValue = {}) => {
  const renderConfigName = (name) => renderName('admin', name)

  return [
    {
      itemProps: { label: '管理员姓名' },
      name: renderConfigName('name'),
      children: <Input disabled={!!initialValue[renderConfigName('name')]} placeholder="请输入" />
    },
    {
      itemProps: { label: '管理员手机号' },
      condition: {
        name: '管理员手机号',
        regex: { regex: PhoneReg }
      },
      name: renderConfigName('phone'),
      children: <Input disabled={!!initialValue[renderConfigName('phone')]} placeholder="请输入" />
    },
    {
      itemProps: { label: '管理员身份证号' },
      condition: {
        name: '管理员身份证号',
        regex: { regex: IDCardReg }
      },
      name: renderConfigName('idCard'),
      children: <Input disabled={!!initialValue[renderConfigName('idCard')]} placeholder="请输入" />
    },
    {
      itemProps: { label: '管理员身份证复印件', wrapperCol: { span: 14 } },
      name: renderConfigName('idCardUrl'),
      rules: [{ validator: validateFiles }],
      children: (
        <Upload
          showOnly={!!initialValue[renderConfigName('idCardUrl')]}
          {...getUploadProps('加盖公章的管理员身份证复印件')}
          accept="pdf,jpg,jpeg,png"
          length={2}
        />
      )
    }
  ]
}

function getUploadProps(extra, required) {
  return {
    minLength: required ? 1 : 0,
    length: 10,
    size: 20,
    extra: `请上传${extra}`,
    accept: 'doc,docx,xls,xlsx,pdf,jpg,jpeg,png',
    listType: 'picture',
    children: <UploadButton />
  }
}
