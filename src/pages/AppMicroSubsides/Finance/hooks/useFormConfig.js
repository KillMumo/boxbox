import React, { useEffect, useCallback, useState } from 'react'
import { Select, Input, AutoComplete, Radio } from 'antd'
import { RowLayout, ColLayout } from '@/utils/Form'
import { TextArea, DatePicker, InputMoney } from '@/components/FormItems'
import fieldValidator, { validateFiles } from '@/utils/fieldValidator'
import Upload from '@/components/Upload'
import useSearchCompanyForApply from '@/pages/AppMicroSubsides/Finance/hooks/useSearchCompanyForApply'
import router from 'umi/router'
import { getBankAccountDetail } from '@/services/microSubsidy/finance'
import { useRequest, useArray } from '@dragon/hooks'
import { previewUrl } from '@/common/config'
import { encodeUrl } from '@/utils'
import AddButton from '../components/AddButton'
import TextAreaWithDelete from '../components/TextAreaWithDelete'
import UploadButton from '../../components/UploadButton'
import SupplyRelationCard from '../../components/SupplyRelationCard'
import { negMoneyReg } from '@/common/reg'
import Card from '@/components/Card'

const url1 =
  'http://matrix-prod-env.oss-cn-shanghai.aliyuncs.com/%E6%8B%85%E4%BF%9D%E7%94%B3%E8%AF%B7%E4%B9%A6%E6%A8%A1%E6%9D%BF202004181.doc?Expires=3058441686&OSSAccessKeyId=LTAI4FuLTur8d4hyP2dPwhL2&Signature=W9wxgV9TOPysTX2%2FCz%2BYJZ8RLCo%3D'

const url2 =
  'http://matrix-prod-env.oss-cn-shanghai.aliyuncs.com/%E6%8E%88%E6%9D%83%E5%8D%8F%E8%AE%AE202004181.pdf?Expires=3058441730&OSSAccessKeyId=LTAI4FuLTur8d4hyP2dPwhL2&Signature=38x1gVyNrxJcLdnPxXzXkvMCWrc%3D'

// 前缀
const renderName = (prefix, name) => `${prefix}.${name}`
// 企业资产配置
export const useOrgAssetsConfig = (form, id, initialValue = {}) => {
  const renderConfigName = useCallback((name) => renderName(`${id}/orgAssets`, name), [id])
  const { getFieldValue } = form
  const [isMortgage, toggleIsMortgage] = useState(true)
  useEffect(() => {
    toggleIsMortgage(getFieldValue(renderConfigName('isMortgaged')) === '是' ? true : false)
  }, [getFieldValue, renderConfigName, initialValue])
  return [
    // 标志
    {
      itemProps: { label: '标志', style: { display: 'none' } },
      name: renderConfigName('id'),
      children: <Input />
    },

    //资产类型
    {
      itemProps: { label: '资产类型' },
      name: renderConfigName('propertyType'),
      rules: [{ required: true, message: '请选择资产类型' }],
      children: (
        <Select placeholder="请选择">
          <Select.Option value="房产" key={1}>
            房产
          </Select.Option>
          <Select.Option value="车辆" key={2}>
            车辆
          </Select.Option>
          <Select.Option value="其他" key={3}>
            其他
          </Select.Option>
        </Select>
      )
    },
    //资产证明
    {
      itemProps: { label: '资产证明', wrapperCol: { span: 14 } },
      name: renderConfigName('propertyCertificateFiles'),
      validateTrigger: 'onChange',
      rules: [{ required: true, message: '请上传资产证明' }, { validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的企业资产证明', true)}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      )
    },
    //是否抵押
    {
      id: 'mortgage',
      itemProps: { label: '是否抵押' },
      name: renderConfigName('isMortgaged'),
      rules: [{ required: true, message: '请选择是否抵押' }],
      children: (
        <Radio.Group onChange={(e) => toggleIsMortgage(!!e.target.value)}>
          <Radio value="是">是</Radio>
          <Radio value="否">否</Radio>
        </Radio.Group>
      )
    },
    //抵押证明
    {
      id: 'mortgagefiles',
      itemProps: { label: '抵押证明', wrapperCol: { span: 14 } },
      name: renderConfigName('mortgageFiles'),
      validateTrigger: 'onChange',
      rules: [{ required: true, message: '请上传抵押证明' }, { validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的企业、法人/实控人及配偶动产、不动产抵押信息', true)}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      ),
      hidden: !isMortgage
    }
  ]
}

// 个人资产配置
export const usePersonAssetsConfig = (form, id, initialValue = {}) => {
  const renderConfigName = useCallback((name) => renderName(`${id}/personAssets`, name), [id])
  const { getFieldValue } = form
  const [isMortgage, toggleIsMortgage] = useState(true)
  useEffect(() => {
    toggleIsMortgage(getFieldValue(renderConfigName('isMortgaged')) === '是' ? true : false)
  }, [getFieldValue, renderConfigName, initialValue])
  return [
    // 标志
    {
      itemProps: { label: '标志', style: { display: 'none' } },
      name: renderConfigName('id'),
      children: <Input />
    },

    //资产类型
    {
      itemProps: { label: '资产类型' },
      name: renderConfigName('propertyType'),
      rules: [{ required: true, message: '请选择资产类型' }],
      children: (
        <Select placeholder="请选择">
          <Select.Option value="房产" key={1}>
            房产
          </Select.Option>
          <Select.Option value="车辆" key={2}>
            车辆
          </Select.Option>
          <Select.Option value="其他" key={3}>
            其他
          </Select.Option>
        </Select>
      )
    },
    //资产证明
    {
      itemProps: { label: '资产证明', wrapperCol: { span: 14 } },
      name: renderConfigName('propertyCertificateFiles'),
      validateTrigger: 'onChange',
      rules: [{ required: true, message: '请上传资产证明' }, { validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的个人资产证明', true)}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      )
    },
    //是否抵押
    {
      id: 'mortgage',
      itemProps: { label: '是否抵押' },
      name: renderConfigName('isMortgaged'),
      rules: [{ required: true, message: '请选择是否抵押' }],
      children: (
        <Radio.Group onChange={(e) => toggleIsMortgage(!!e.target.value)}>
          <Radio value="是">是</Radio>
          <Radio value="否">否</Radio>
        </Radio.Group>
      )
    },
    //抵押证明
    {
      id: 'mortgagefiles',
      itemProps: { label: '抵押证明', wrapperCol: { span: 14 } },
      name: renderConfigName('mortgageFiles'),
      validateTrigger: 'onChange',
      rules: [{ required: true, message: '请上传抵押证明' }, { validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的企业、法人/实控人及配偶动产、不动产抵押信息', true)}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      ),
      hidden: !isMortgage
    }
  ]
}

// 融资信息
export const useFinanceConfig = (form, saveDetail, orgName) => {
  const { setFieldsValue } = form

  // const handleClick = (e, url) => {
  //   e.stopPropagation()
  //   window.open(`${previewUrl}${encodeUrl(url)}`)
  // }

  // 模糊搜索企业名
  const {
    setCompanyDetail,
    companyDetail,
    bankAccountList,
    setBankAccount,
    fetchCompanyDetailReq,
    loading,
    props: autoCompleteProps
  } = useSearchCompanyForApply()

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
    if (saveDetail?.extra?.orgName) {
      fetchCompanyDetailReq({ orgName: saveDetail?.extra?.orgName })
    }
  }, [fetchCompanyDetailReq, saveDetail])

  useEffect(() => {
    if (orgName) {
      fetchCompanyDetailReq({ orgName })
    }
  }, [fetchCompanyDetailReq, orgName])

  return {
    // loanList: loanList,
    detail: companyDetail,
    financeConfig: [
      //企业全称
      {
        itemProps: {
          label: '申请担保企业全称',
          extra: autoCompleteProps.extra
        },
        name: 'orgName',
        rules: [
          {
            required: true,
            validator: fieldValidator,
            name: '申请担保企业全称',
            length: { min: 1, max: 50 }
          }
        ],
        children: (
          <AutoComplete
            //如果是编辑页面，企业名称不可修改
            disabled={saveDetail?.extra?.orgName}
            {...autoCompleteProps}
            placeholder="请输入"
            onChange={() => {
              setCompanyDetail && setCompanyDetail({})
              setBankAccount && setBankAccount([])
              setFieldsValue({
                bankAccount: '',
                bankSiteName: '',
                bankProvince: '',
                bankCity: '',
                bankBranch: '',
                supply: { title: '供应商' }
              })
            }}
          />
        )
      },
      //申请融资金额
      {
        itemProps: { label: '申请担保金额' },
        name: 'applyFinanceAmount',
        rules: [
          {
            required: true,
            validator: fieldValidator,
            name: '申请担保金额',
            boundary: { min: 0, max: 100000000, msg: '请输入0-100000000内数字' }
          }
        ],
        children: <InputMoney placeholder="请输入" addonAfter="元" />
      },
      // 预计还款日
      {
        itemProps: { label: '预计还款日' },
        name: 'paymentDate',
        rules: [
          {
            required: true,
            message: '请选择预计还款日'
          }
        ],
        children: <DatePicker style={{ width: '100%' }} placeholder="请选择" />
      },
      //上一年度营业额
      {
        itemProps: { label: '上一年度营业额' },
        name: 'lastYearProfit',
        condition: {
          required: true,
          validator: fieldValidator,
          name: '营业额',
          regex: { regex: negMoneyReg }
        },
        children: <InputMoney placeholder="请输入" neg="true" addonAfter="元" />
      },
      //上一年度净利润
      {
        itemProps: { label: '上一年度税务报表净利润' },
        name: 'lastYearBizAmount',
        condition: {
          required: true,
          validator: fieldValidator,
          name: '税务报表净利润',
          regex: { regex: negMoneyReg }
        },
        children: <InputMoney placeholder="请输入" neg="true" addonAfter="元" />
      },
      //融资银行账号
      {
        itemProps: {
          label: '放款账号',
          extra: companyDetail.orgId && (
            <span>
              未找到银行账号？
              <a
                onClick={() => {
                  router.push(`/msEnterprise/company/edit/${companyDetail.orgId}`)
                }}
              >
                去完善
              </a>
            </span>
          )
        },
        name: 'bankAccount',
        condition: {
          required: true,
          name: '放款账号',
          length: { min: 0, max: 30 }
        },
        children: (
          <Select placeholder="请选择" onSelect={onAccountSelect}>
            {bankAccountList.map((b) => (
              <Select.Option value={b.bankNumber} key={b.id}>
                {b.bankNumber}
              </Select.Option>
            ))}
          </Select>
        )
      },
      {
        itemProps: { label: '开户银行' },
        name: 'bankSiteName',
        rules: [{ required: true, message: '请选择开户银行' }],
        children: <Input disabled />
      },
      {
        id: 'damn', // id作为key
        itemProps: {
          label: '开户省市',
          required: true
        },
        layout: { container: RowLayout },
        condition: {
          required: true,
          name: '开户省市'
        },
        children: [
          {
            name: 'bankProvince',
            layout: { container: ColLayout },
            rules: [{ required: true, message: '请选择省份' }],
            children: <Input disabled />
          },
          {
            name: 'bankCity',
            layout: { container: ColLayout },
            rules: [{ required: true, message: '请选择城市' }],
            children: <Input disabled />
          }
        ]
      },
      {
        itemProps: {
          label: '所属支行'
        },
        rules: [{ required: true, message: '请选择所属支行' }],
        name: 'bankBranch',
        children: <Input disabled />
      },
      //融资目的
      {
        itemProps: { label: '资金用途', wrapperCol: { span: 10 } },
        name: 'financePurpose',
        rules: [{ required: true, message: '请输入资金用途', whitespace: true }],
        children: <TextArea placeholder="请输入" />
      },
      //担保申请表
      {
        itemProps: { label: '担保申请表', wrapperCol: { span: 14 } },
        name: 'guaranteeFiles',
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传担保申请表' }, { validator: validateFiles }],
        children: (
          <Upload
            minLength="1"
            length="10"
            size="20"
            extra="请上传加盖公章的担保申请表"
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
            listType="picture"
          >
            <UploadButton />
            <a
              onClick={(e) => {
                // handleClick(e, url1)
                e.stopPropagation()
                window.open(url1)
              }}
              // target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 10 }}
            >
              下载模板
            </a>
          </Upload>
        )
      },
      {
        itemProps: { label: '授权协议', wrapperCol: { span: 14 } },
        name: 'authorizeFiles',
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传授权协议' }, { validator: validateFiles }],
        children: (
          <Upload
            minLength="1"
            length="10"
            size="20"
            extra="请上传加盖公章的授权协议"
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
            listType="picture"
          >
            <UploadButton />
            <a
              onClick={(e) => {
                // handleClick(e, url2)
                e.stopPropagation()
                window.open(url2)
              }}
              // target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 10 }}
            >
              下载模板
            </a>
          </Upload>
        )
      },
      {
        itemProps: { label: '供销关系', wrapperCol: { span: 14 } },
        name: 'supply',
        children: (
          <SupplyRelationCard
            data={companyDetail}
            url={companyDetail.orgId ? `/msEnterprise/company/edit/${companyDetail.orgId}` : ''}
            type="ywy"
            start={fetchCompanyDetailReq}
            loading={loading}
          />
        )
      },
      {
        itemProps: { label: '审计报告/财务报表', wrapperCol: { span: 14 } },
        name: 'auditFiles',
        validateTrigger: 'onChange',
        rules: [
          { required: true, message: '请上传审计报告/财务报表' },
          { validator: validateFiles }
        ],
        children: (
          <Upload
            {...getUploadProps('加盖公章的近两年审计报告及近期财务报表', true)}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      {
        itemProps: { label: '纳税凭证', wrapperCol: { span: 14 } },
        name: 'payTaxesFiles',
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传纳税凭证' }, { validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps('加盖公章的近两年纳税凭证', true)}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      {
        itemProps: { label: '身份证明', wrapperCol: { span: 14 } },
        name: 'IdentifyFiles',
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传身份证明' }, { validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps(
              '加盖公章的企业法人/实控人及其配偶身份证、结婚证（离婚证或单身证明）、户口本复印件',
              true
            )}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      {
        itemProps: { label: '信用卡记录', wrapperCol: { span: 14 } },
        name: 'creditRecordFiles',
        validateTrigger: 'onChange',
        rules: [{ validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps('加盖公章的法人/实控人及其配偶、父母、子女等关联人信用卡记录')}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      {
        itemProps: { label: '办公场地租赁', wrapperCol: { span: 14 } },
        name: 'orgRentFiles',
        validateTrigger: 'onChange',
        rules: [{ validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps('加盖公章的土地、房屋租赁合同')}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      {
        itemProps: { label: '水电使用情况', wrapperCol: { span: 14 } },
        name: 'orgOfficeFiles',
        validateTrigger: 'onChange',
        rules: [{ validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps('加盖公章的近一年企业、厂房等水电使用情况')}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      // 带标题分割线
      {
        itemProps: { label: '', wrapperCol: { span: 24 } },
        name: '',
        children: <Card.SubCard title="对账单流水" />
      },
      {
        itemProps: { label: '对公流水', wrapperCol: { span: 14 } },
        name: 'orgFlowFiles',
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传对账单流水' }, { validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps('加盖公章的企业对公账户近一年的流水', true)}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      {
        itemProps: { label: '个人流水', wrapperCol: { span: 14 } },
        name: 'personFlowFiles',
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传对账单流水' }, { validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps('加盖公章的企业或法人/实控人近一年的对账单流水', true)}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      // 带标题分割线
      {
        itemProps: { label: '', wrapperCol: { span: 24 } },
        name: '',
        children: <Card.SubCard title="征信" />
      },
      {
        itemProps: { label: '企业征信', wrapperCol: { span: 14 } },
        name: 'orgCreditFiles',
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传企业征信' }, { validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps('加盖公章的企业征信', true)}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      {
        itemProps: { label: '个人征信', wrapperCol: { span: 14 } },
        name: 'personCreditFiles',
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传个人征信' }, { validator: validateFiles }],
        children: (
          <Upload
            {...getUploadProps('加盖公章的法人/实际控制人及其配偶、父母、子女等关联人征信', true)}
            accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
          />
        )
      },
      // 分割线
      {
        itemProps: { label: '', wrapperCol: { span: 24 } },
        name: '',
        children: <Card.SubCard title="资产信息" />
      }
    ]
  }
}

// 其他融资信息
export const useOtherConfig = (form, saveDetail) => {
  // 借款情况列表数组
  const [loanList, { push: addLoan, set: setLoanList, remove: deleteLoan }] = useArray([])

  //借款情况列表
  const Items = () =>
    loanList.map((k, index) => ({
      id: k.id,
      itemProps: {
        label: index === 0 ? '企业借款情况' : '',
        wrapperCol: index === 0 ? { span: 10 } : { span: 10, offset: 4 }
      },
      name: `${k.id}/orgLoanInfo`, // 拼上id，指定唯一值，不能用index
      children: (
        //封装了textarea和删除按钮的动态组件
        <TextAreaWithDelete
          placeholder="请输入"
          handleDelete={() => deleteLoan((d) => d.id === k.id)}
        />
      )
    }))

  // 个人借款情况列表数组
  const [
    personLoanList,
    { push: addPersonLoan, set: setPersonLoanList, remove: deletePersonLoan }
  ] = useArray([])

  // 个人借款情况列表
  const personItems = () =>
    personLoanList.map((k, index) => ({
      id: k.id,
      itemProps: {
        label: index === 0 ? '个人借款情况' : '',
        wrapperCol: index === 0 ? { span: 10 } : { span: 10, offset: 4 }
      },
      name: `${k.id}/personLoanInfo`, // 拼上id，指定唯一值，不能用index
      children: (
        //封装了textarea和删除按钮的动态组件
        <TextAreaWithDelete
          placeholder="请输入"
          handleDelete={() => deletePersonLoan((d) => d.id === k.id)}
        />
      )
    }))

  useEffect(() => {
    if (saveDetail?.extra?.orgLoanInfo || saveDetail?.extra?.personLoanInfo) {
      //编辑页面，如果有借款情况的话，把loanList置为后端返回的借款情况数据
      setLoanList(
        saveDetail.extra.orgLoanInfo?.map((i, ii) => ({
          id: ii,
          v: i
        }))
      )
      setPersonLoanList(
        saveDetail.extra.personLoanInfo?.map((i, ii) => ({
          id: ii,
          v: i
        }))
      )
    }
  }, [saveDetail, setLoanList, setPersonLoanList])

  return [
    // 分割线
    {
      itemProps: { label: '', wrapperCol: { span: 24 } },
      name: '',
      children: <Card.SubCard title="借款情况" />
    },
    // 企业借款情况
    ...Items(),
    {
      id: 'orgLoan',
      itemProps: {
        label: loanList.length === 0 ? '企业借款情况' : '',
        wrapperCol: loanList.length === 0 ? { span: 14 } : { span: 14, offset: 4 }
      },
      name: '',
      children: loanList.length < 10 && (
        <AddButton
          onClick={() => addLoan({ id: Date.now() })}
          extra={
            <div style={{ lineHeight: 1.6 }}>
              <div>
                请分条填写暂未还清的借款情况，包含内容：借款人、借款时间、出借人、借款金额、借款用途
              </div>
              <div>
                如：法人A/实控人A/宁波A公司于2020年1月1日向姓名B/宁波B公司借款10万元，用于扩大经营
              </div>
            </div>
          }
        >
          添加一笔借款情况
        </AddButton>
      )
    },
    // 个人借款情况
    ...personItems(),
    {
      id: 'personLoan',
      itemProps: {
        label: personLoanList.length === 0 ? '个人借款情况' : '',
        wrapperCol: personLoanList.length === 0 ? { span: 14 } : { span: 14, offset: 4 }
      },
      name: '',
      children: personLoanList.length < 10 && (
        <AddButton
          onClick={() => addPersonLoan({ id: Date.now() })}
          extra={
            <div style={{ lineHeight: 1.6 }}>
              <div>
                温馨提示：请分条填写暂未还清的借款情况，包含内容：借款人、借款时间、出借人、借款金额、借款用途
              </div>
              <div>
                如：法人A/实控人A/宁波A公司于2020年1月1日向姓名B/宁波B公司借款10万元，用于扩大经营
              </div>
            </div>
          }
        >
          添加一笔借款情况
        </AddButton>
      )
    },

    // 分割线
    {
      itemProps: { label: '', wrapperCol: { span: 24 } },
      name: '',
      children: (
        <div style={{ height: '1px', background: 'rgba(238, 238, 238, 1)', margin: 'auto' }} />
      )
    },
    {
      itemProps: { label: '其他材料', wrapperCol: { span: 14 } },
      name: 'otherFinanceFiles',
      validateTrigger: 'onChange',
      rules: [{ validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的其他材料')}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      )
    },
    {
      itemProps: { label: '备注', wrapperCol: { span: 10 } },
      name: 'remark',
      children: <TextArea placeholder="请输入" />
    }
  ]
}

// 反担保信息
export const useGuaranteeConfig = (form) => {
  return [
    //企业全称
    {
      itemProps: { label: '反担保企业全称' },
      name: 'cgOrg',
      children: <Input placeholder="请输入" />
    },
    //营业执照
    {
      itemProps: { label: '营业执照', wrapperCol: { span: 14 } },
      name: 'cgOrgLicenseFiles',
      validateTrigger: 'onChange',
      rules: [{ validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的反担保企业营业执照正本、副本、开户许可证复印件')}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      )
    },
    //审计报表
    {
      itemProps: { label: '审计报告/财务报表', wrapperCol: { span: 14 } },
      name: 'cgAuditFiles',
      validateTrigger: 'onChange',
      rules: [{ validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的反担保企业近两年审计报告及近期财务报表')}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      )
    },
    {
      itemProps: { label: '企业身份证明', wrapperCol: { span: 14 } },
      name: 'cgOrgIdentifyFiles',
      validateTrigger: 'onChange',
      rules: [{ validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps(
            '加盖公章的反担保企业法人/实际控制人及其配偶身份证、结婚证（离婚证或单身证明）、户口本复印件'
          )}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      )
    },
    {
      itemProps: { label: '其他反担保企业材料', wrapperCol: { span: 14 } },
      name: 'cgOrgOtherFiles',
      validateTrigger: 'onChange',
      rules: [{ validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的反担保企业材料')}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      )
    },
    // 分割线
    {
      itemProps: { label: '', wrapperCol: { span: 24 } },
      name: '',
      children: (
        <div style={{ height: '1px', background: 'rgba(238, 238, 238, 1)', margin: 'auto' }} />
      )
    },
    {
      itemProps: { label: '反担保个人姓名' },
      name: 'cgPersonName',
      children: <Input placeholder="请输入" />
    },
    {
      itemProps: { label: '个人身份证明', wrapperCol: { span: 14 } },
      name: 'cgIdentifyFiles',
      validateTrigger: 'onChange',
      rules: [{ validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps(
            '加盖公章的个人反担保的身份证、结婚证（离婚证或单身证明）、户口本复印件、个人征信报告'
          )}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
        />
      )
    },
    {
      itemProps: { label: '其他反担保个人材料', wrapperCol: { span: 14 } },
      name: 'cgOtherFiles',
      validateTrigger: 'onChange',
      rules: [{ validator: validateFiles }],
      children: (
        <Upload
          {...getUploadProps('加盖公章的其他个人反担保个人材料')}
          accept="doc,docx,xls,xlsx,pdf,jpg,jpeg,png"
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
