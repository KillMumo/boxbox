import React from 'react'
import { InputNumber } from 'antd'
import { InputMoney } from '@/components/FormItems'
import { negMoneyReg } from '@/common/reg'
import validator from '../../../../utils/fieldValidator'

const FormItem = ({ value }) => <span>{value}%</span>

// 财务信息
export const useCalculateConfig = (form) => {
  return [
    {
      itemProps: { label: '负债总额(元)' },
      name: 'finDebtAmount',
      rules: [
        {
          validator: validator,
          name: '负债总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '资产总额(元)' },
      name: 'finAssetAmount',
      condition: { validator: validator, name: '金额', regex: { regex: negMoneyReg } },
      children: <InputMoney placeholder="请输入" neg="true" />
    },
    {
      itemProps: { label: '资产负债率' },
      name: 'finAssetDebtRate',
      children: <FormItem />
    },
    {
      itemProps: { label: '流动资产(元)' },
      rules: [
        {
          validator: validator,
          name: '流动资产',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      name: 'finFlowAsset',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '流动负债(元)' },
      rules: [
        {
          validator: validator,
          name: '流动负债',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      name: 'finFlowDebt',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '流动比率' },
      name: 'finFlowRate',
      children: <FormItem />
    },
    {
      itemProps: { label: '库存(元)' },
      rules: [
        {
          validator: validator,
          name: '库存',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      name: 'finStock',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '速动比率' },
      name: 'finQuickRate',
      children: <FormItem />
    },
    {
      itemProps: { label: '销售/营业成本(元)' },
      rules: [
        {
          validator: validator,
          name: '销售/营业成本',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      name: 'finCost',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '平均存货(元)' },
      rules: [
        {
          validator: validator,
          name: '平均存货',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      name: 'finAvgStock',
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '存货周转率' },
      name: 'finTurnoverRate',
      children: <FormItem />
    }
  ]
}

// 纳税信息
export const useTaxConfig = (form) => {
  return [
    {
      itemProps: { label: '累计实缴金额(元)' },
      name: 'taxAmount',
      rules: [
        {
          validator: validator,
          name: '累计实缴金额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    }
  ]
}

// 信用卡信息
export const useCreditRecordConfig = (form) => {
  return [
    {
      itemProps: { label: '月平均消费金额(元)' },
      name: 'creditAvgAmount',
      rules: [
        {
          validator: validator,
          name: '月平均消费金额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '逾期次数' },
      name: 'creditDueCount',
      children: <InputNumber style={{ width: '100%' }} precision={0} min={0} max={100} />
    }
  ]
}

// 流水信息
export const useFlowConfig = (form) => {
  return [
    {
      itemProps: { label: '' },
      name: '',
      children: <div>对公流水</div>
    },
    {
      itemProps: { label: '近一年收支差额(元)' },
      name: 'orgFlowAmount',
      condition: { validator: validator, name: '金额', regex: { regex: negMoneyReg } },
      children: <InputMoney placeholder="请输入" neg="true" />
    },
    {
      itemProps: { label: '月均收支差额(元)' },
      name: 'orgFlowAvgAmount',
      condition: { validator: validator, name: '金额', regex: { regex: negMoneyReg } },
      children: <InputMoney placeholder="请输入" neg="true" />
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>个人流水</div>
    },
    {
      itemProps: { label: '近一年收支差额(元)' },
      name: 'personFlowAmount',
      condition: { validator: validator, name: '金额', regex: { regex: negMoneyReg } },
      children: <InputMoney placeholder="请输入" neg="true" />
    },
    {
      itemProps: { label: '月均收支差额(元)' },
      name: 'personFlowAvgAmount',
      condition: { validator: validator, name: '金额', regex: { regex: negMoneyReg } },
      children: <InputMoney placeholder="请输入" neg="true" />
    }
  ]
}

// 征信信息
export const useCreditConfig = (form) => {
  return [
    {
      itemProps: { label: '' },
      name: '',
      children: <div>企业征信</div>
    },
    {
      itemProps: { label: '在贷总额(元)' },
      name: 'orgCreditAmount',
      rules: [
        {
          validator: validator,
          name: '在贷总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '不良/违约总额(元)' },
      name: 'orgCreditDueAmount',
      rules: [
        {
          validator: validator,
          name: '不良/违约总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>个人征信</div>
    },
    {
      itemProps: { label: '在贷总额(元)' },
      name: 'personCreditAmount',
      rules: [
        {
          validator: validator,
          name: '在贷总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '不良/违约总额(元)' },
      name: 'personCreditDueAmount',
      rules: [
        {
          validator: validator,
          name: '不良/违约总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    }
  ]
}

// 资产信息
export const useAssetsConfig = (form) => {
  return [
    {
      itemProps: { label: '' },
      name: '',
      children: <div>企业资产</div>
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>房产</div>
    },
    {
      itemProps: { label: '市场预估总价(元)' },
      name: 'orgAssetsHouseAmount',
      rules: [
        {
          validator: validator,
          name: '市场预估总价',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '抵押总额(元)' },
      name: 'orgAssetsHouseMortgageAmount',
      rules: [
        {
          validator: validator,
          name: '抵押总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>车辆</div>
    },
    {
      itemProps: { label: '市场预估总价(元)' },
      name: 'orgAssetsCarAmount',
      rules: [
        {
          validator: validator,
          name: '市场预估总价',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '抵押总额(元)' },
      name: 'orgAssetsCarMortgageAmount',
      rules: [
        {
          validator: validator,
          name: '抵押总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>其他</div>
    },
    {
      itemProps: { label: '市场预估总价(元)' },
      name: 'orgAssetsOtherAmount',
      rules: [
        {
          validator: validator,
          name: '市场预估总价',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '抵押总额(元)' },
      name: 'orgAssetsOtherMortgageAmount',
      rules: [
        {
          validator: validator,
          name: '抵押总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    //分割线
    {
      itemProps: { label: '', wrapperCol: { span: 24 } },
      name: '',
      children: (
        <div style={{ height: '1px', background: 'rgba(238, 238, 238, 1)', margin: 'auto' }} />
      )
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>个人资产</div>
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>房产</div>
    },
    {
      itemProps: { label: '市场预估总价(元)' },
      name: 'personAssetsHouseAmount',
      rules: [
        {
          validator: validator,
          name: '市场预估总价',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '抵押总额(元)' },
      name: 'personAssetsHouseMortgageAmount',
      rules: [
        {
          validator: validator,
          name: '抵押总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>车辆</div>
    },
    {
      itemProps: { label: '市场预估总价(元)' },
      name: 'personAssetsCarAmount',
      rules: [
        {
          validator: validator,
          name: '市场预估总价',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '抵押总额(元)' },
      name: 'personAssetsCarMortgageAmount',
      rules: [
        {
          validator: validator,
          name: '抵押总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>其他</div>
    },
    {
      itemProps: { label: '市场预估总价(元)' },
      name: 'personAssetsOtherAmount',
      rules: [
        {
          validator: validator,
          name: '市场预估总价',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '抵押总额(元)' },
      name: 'personAssetsOtherMortgageAmount',
      rules: [
        {
          validator: validator,
          name: '抵押总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    }
  ]
}

// 借款信息
export const useLoanConfig = (form) => {
  return [
    {
      itemProps: { label: '' },
      name: '',
      children: <div>企业借款情况</div>
    },
    {
      itemProps: { label: '借款总额(元)' },
      name: 'orgLoanAmount',
      rules: [
        {
          validator: validator,
          name: '借款总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    },
    {
      itemProps: { label: '' },
      name: '',
      children: <div>个人借款情况</div>
    },
    {
      itemProps: { label: '借款总额(元)' },
      name: 'personLoanAmount',
      rules: [
        {
          validator: validator,
          name: '借款总额',
          boundary: { min: -1, max: 100000000, msg: '请输入0-100000000内数字' }
        }
      ],
      children: <InputMoney placeholder="请输入" />
    }
  ]
}
