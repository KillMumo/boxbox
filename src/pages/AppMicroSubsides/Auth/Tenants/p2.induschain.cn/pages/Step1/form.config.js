import React from 'react'
import { Input, Radio, Button } from 'antd'
import { PhoneReg, IDCardReg } from '@/common/reg'
// import { usePageContext } from '../../../../store'
import Upload from '@/components/Upload'
import { validateFiles } from '@/utils/fieldValidator'
import idcard from '@/assets/auth/身份证@2x.png'
import bussiness from '@/assets/auth/营业执照@2x.png'

const uploadAccept = 'jpg,jpeg,png'
// 实控人是否隐藏
const hiddenIsRealControl = (form) => {
  const { isRealControlPerson = 1 } = form.getFieldsValue()
  return isRealControlPerson === 1
}
// 企业的配置
export const useCompanyConfig = () => {
  return [
    {
      itemProps: { label: '企业全称' },
      condition: {
        required: true,
        name: '企业全称',
        length: { min: 1, max: 50 }
      },
      name: 'companyName', // 字段名
      children: <Input disabled />
    },
    {
      itemProps: {
        label: '营业执照'
      },
      validateTrigger: 'onChange',
      condition: { whitespace: false },
      rules: [{ required: true, message: '请上传营业执照' }, { validator: validateFiles }],
      name: 'businessLicenseUrl',
      children: (
        <Upload
          accept={uploadAccept}
          extra="请上传加盖公章的营业执照"
          minLength={1}
          size={20}
          example={bussiness}
        />
      )
    },
    {
      itemProps: {
        label: '企业章程'
      },
      validateTrigger: 'onChange',
      condition: { whitespace: false },
      rules: [{ required: true, message: '请上传企业章程' }, { validator: validateFiles }],
      name: 'organizationRuleUrl',
      children: (
        <Upload
          listType="picture"
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          minLength={1}
          size={20}
          length={10}
          extra="请上传加盖公章的企业章程"
        >
          <Button icon="plus">上传</Button>
        </Upload>
      )
    },
    {
      itemProps: {
        label: '测试新增字段'
      },
      validateTrigger: 'onChange',
      condition: { whitespace: false },
      rules: [{ required: true, message: '请上传测试新增字段' }, { validator: validateFiles }],
      name: 'testFile',
      children: (
        <Upload
          listType="picture"
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          minLength={1}
          size={20}
          length={10}
          extra="请上传加盖公章的测试新增字段"
        >
          <Button icon="plus">上传</Button>
        </Upload>
      )
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
      children: <Input disabled />
    },
    // {
    //   itemProps: { label: '法人手机号' },
    //   condition: {
    //     required: true,
    //     name: '法人手机号',
    //     regex: { regex: PhoneReg }
    //   },
    //   name: 'legalPersonPhone',
    //   children: <Input placeholder="请输入" />
    // },
    {
      itemProps: {
        label: '法人身份证复印件'
      },
      validateTrigger: 'onChange',
      condition: { whitespace: false },
      rules: [{ required: true, message: '请上传法人身份证复印件' }, { validator: validateFiles }],
      name: 'legalPersonIdCardUrl',
      children: (
        <Upload
          accept={uploadAccept}
          extra="请上传加盖公章的法人身份证复印件"
          minLength={1}
          size={20}
          length={2}
          example={idcard}
        />
      )
    },
    {
      itemProps: { label: '法人是否是实控人' },
      name: 'isRealControlPerson',
      condition: { type: 'select' },
      children: (
        <Radio.Group
        // onChange={(e) => toggleIsControl(!!e.target.value)}
        >
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
      hidden: hiddenIsRealControl
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
      hidden: hiddenIsRealControl
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
      hidden: hiddenIsRealControl
    },
    {
      itemProps: {
        label: '实控人身份证复印件'
      },
      validateTrigger: 'onChange',
      condition: { whitespace: false },
      rules: [
        { required: true, message: '请上传实控人身份证复印件' },
        { validator: validateFiles }
      ],
      name: 'realControlPersonIdCardUrl',
      children: (
        <Upload
          accept={uploadAccept}
          extra="请上传加盖公章的实控人身份证复印件"
          minLength={1}
          size={20}
          length={2}
          example={idcard}
        />
      ),
      hidden: hiddenIsRealControl
    }
  ]
}

// 管理员的配置
export const useAdminConfig = () => {
  return [
    {
      itemProps: { label: '姓名' },
      condition: {
        required: true,
        name: '姓名',
        length: { min: 1, max: 10 }
      },
      name: 'orgAdminName',
      children: <Input disabled />
    },
    {
      itemProps: { label: '身份证号' },
      condition: {
        required: true,
        name: '身份证号',
        regex: { regex: IDCardReg }
      },
      name: 'orgAdminIdCard',
      children: <Input disabled />
    },
    // {
    //   itemProps: { label: '手机号' },
    //   condition: {
    //     required: true,
    //     name: '手机号',
    //     regex: { regex: PhoneReg }
    //   },
    //   name: 'orgAdminPhone',
    //   children: <Input placeholder="请输入" />
    // },
    {
      itemProps: {
        label: '管理员身份证复印件'
      },
      validateTrigger: 'onChange',
      condition: { whitespace: false },
      rules: [
        { required: true, message: '请上传管理员身份证复印件' },
        { validator: validateFiles }
      ],
      name: 'orgAdminIdCardUrl',
      children: (
        <Upload
          accept={uploadAccept}
          extra="请上传加盖公章的管理员身份证复印件"
          minLength={1}
          size={20}
          length={2}
          example={idcard}
        />
      )
    }
  ]
}
