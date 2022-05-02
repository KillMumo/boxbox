import React from 'react'
import useProvinceAndCityWithBank from '@/hooks/useProvinceAndCityWithBank'
import { Select, Input, Checkbox } from 'antd'
import { BankCodeReg } from '@/common/reg'
import { renderRow, renderCol } from '@dragon/form'
import { usePageContext } from '../../store'
import { fetchToken } from '@/common/token'

const validator = (r, v, cb) => {
  if (v === true) {
    cb()
  } else {
    cb('请阅读并同意《认证用户服务协议》')
  }
}

// 银行的配置
export const useBankConfig = (isEdit) => {
  const { form } = usePageContext()
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
    bankLabel: 'openBank',
    cityLabel: 'openCity',
    branchLabel: 'openSubBranch',
    provinceLabel: 'openProvince'
  })

  return [
    {
      itemProps: { label: '开户银行' },
      name: 'openBank',
      condition: { required: true, type: 'select', name: '开户银行' },
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
      name: 'bankNumber',
      children: <Input placeholder="请输入" />
    },
    {
      id: 'damn', // id作为key
      itemProps: { label: '省市', required: true },
      render: renderRow,
      children: [
        {
          name: 'openProvince',
          render: renderCol,
          condition: { required: true, type: 'select', name: '省份' },
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
          name: 'openCity',
          render: renderCol,
          condition: { required: true, type: 'select', name: '城市' },
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
      condition: { required: true, type: 'select', name: '所属支行' },
      name: 'openSubBranch',
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
      name: 'openSubBranch',
      children: <Input placeholder="请输入" />,
      hidden: !isManual
    },
    {
      itemProps: { wrapperCol: { offset: 5 } },
      name: 'isAgree',
      condition: { whitespace: false },
      rules: [{ validator }],
      validateTrigger: 'onChange',
      valuePropName: 'checked',
      children: (
        <div>
          <Checkbox />
          &nbsp;&nbsp;请阅读并同意
          <a
            href={`/matrix/agreement/registration?token=${fetchToken()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            《认证用户服务协议》
          </a>
        </div>
      ),
      hidden: isEdit
    }
  ]
}
