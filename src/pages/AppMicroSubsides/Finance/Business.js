import React from 'react'
import { Button, Form, message } from 'antd'
import Anchor from '@/components/Anchor'
import styles from './styles.less'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { renderForm } from '@/utils/Form'
import {
  useCalculateConfig,
  useTaxConfig,
  useCreditRecordConfig,
  useFlowConfig,
  useCreditConfig,
  useAssetsConfig,
  useLoanConfig
} from './hooks/useBusinessConfig'
import router from 'umi/router'
import {
  startBusiness,
  saveBusiness,
  fetchBusinessInfo
  // fetchBusiness
} from '@/services/microSubsidy/finance'
import { useRequest } from '@dragon/hooks'
import { useSelector } from 'react-redux'
import { isEmpty } from '@/utils'

const formLayout = {
  labelAlign: 'right',
  colon: false,
  labelCol: { span: 6 },
  wrapperCol: { span: 10 }
}
const Business = (props) => {
  const {
    form: { validateFieldsAndScroll, getFieldsValue },
    match: {
      params: { id }
    }
  } = props

  const anchorList = [
    { key: '1', tab: '财务信息' },
    { key: '2', tab: '纳税信息' },
    { key: '3', tab: '信用卡信息' },
    { key: '4', tab: '对账单流水' },
    { key: '5', tab: '征信' },
    { key: '6', tab: '资产信息' },
    { key: '7', tab: '借款情况' }
  ]

  // 财务信息
  const calculateConfig = useCalculateConfig(props.form)

  // 纳税信息
  const taxConfig = useTaxConfig(props.form)

  // 信用卡信息
  const creditRecordConfig = useCreditRecordConfig(props.form)

  // 对账单流水信息
  const flowConfig = useFlowConfig(props.form)

  // 征信信息
  const creditConfig = useCreditConfig(props.form)

  // 资产信息
  const assetsConfig = useAssetsConfig(props.form)

  // 借款信息
  const loanConfig = useLoanConfig(props.form)

  // 获取redux里当前用户的企业信息
  const userName = useSelector(({ user }) => user.user.userName)

  // 发起的方法
  const { loading: submitLoading, start: startBusinessReq } = useRequest(startBusiness, {
    manual: true,
    onSuccess: (res) => {
      message.success('提交成功')
      router.push(`/msFinance/businessSuccess/${id}`)
    }
  })

  // 暂存的方法
  const { loading: saveLoading, start: saveBusinessReq } = useRequest(saveBusiness, {
    manual: true,
    onSuccess: (res) => {
      message.success('保存成功')
      router.push(`/msFinance/view/${id}`)
    }
  })

  // 保存之后获取融资详情
  const { data: info = {}, loading: fetching } = useRequest(
    () => fetchBusinessInfo({ bizNo: id, formKey: 'biz_estimate' }),
    {
      // onSuccess: (res) => {
      //   fetchCmyDetailReq({ bizNo: id })
      // }
    }
  )

  let mydata = {}

  const handleSubmit = (e) => {
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = encode(values)

        // 提交表单
        startBusinessReq({
          bizNo: id,
          bizEstimateUserName: userName,
          bizEstimateDate: Date.now(),
          ...params
        })

        // if (window.opener && !window.opener.closed) {
        //   mydata.fromOpenner = true
        //   window.opener.postMessage(mydata)
        // }
        mydata = +new Date()
        window.localStorage.setItem('ctc-msg', JSON.stringify(mydata))
      }
    })
  }
  // 暂存
  const handleSave = () => {
    const values = getFieldsValue()
    const params = encode(values)

    // 保存表单
    saveBusinessReq({
      bizNo: id,
      formKey: 'biz_estimate',
      ...params
    })
  }

  return (
    <div className={styles.reportWrap}>
      <div className={styles.header}>
        <div className={styles.title}>业务评估</div>
        <div className={styles.desc}>业务评估信息的完善度会影响企业的风控评分,请填写完整</div>
      </div>
      <div style={{ margin: '0px -18px' }}>
        <Anchor anchorList={anchorList} targetOffset={268} />
      </div>
      {/* <div style={{ background: 'rgba(255,255,255,1)', marginBottom: 8 }}>{renderTabs()}</div> */}
      <Form {...formLayout} onSubmit={handleSubmit}>
        <Card transparent loading={fetching} style={{ marginTop: 2 }}>
          <Card title={<span id="1">财务信息</span>} style={{ margin: 0, border: 'none' }}>
            {renderForm(calculateConfig, { form: props.form, initialValue: { ...info } })}
          </Card>
          <Card title={<span id="2">纳税信息</span>} style={{ margin: 0, border: 'none' }}>
            {renderForm(taxConfig, { form: props.form, initialValue: { ...info } })}
          </Card>
          <Card title={<span id="3">信用卡信息</span>} style={{ margin: 0, border: 'none' }}>
            {renderForm(creditRecordConfig, { form: props.form, initialValue: { ...info } })}
          </Card>
          <Card title={<span id="4">对账单流水</span>} style={{ margin: 0, border: 'none' }}>
            {renderForm(flowConfig, { form: props.form, initialValue: { ...info } })}
          </Card>
          <Card title={<span id="5">征信</span>} style={{ margin: 0, border: 'none' }}>
            {renderForm(creditConfig, { form: props.form, initialValue: { ...info } })}
          </Card>
          <Card title={<span id="6">资产信息</span>} style={{ margin: 0, border: 'none' }}>
            {renderForm(assetsConfig, { form: props.form, initialValue: { ...info } })}
          </Card>
          <Card
            title={<span id="7">借款情况</span>}
            style={{ margin: 0, border: 'none', marginBottom: 50 }}
          >
            {renderForm(loanConfig, { form: props.form, initialValue: { ...info } })}
          </Card>
          <div
            style={{
              position: 'fixed',
              bottom: '0px',
              left: 0,
              width: '100%',
              height: 50,
              background: 'rgba(255,255,255,1)',
              boxShadow: '0px -2px 4px 0px rgba(0,0,0,0.1)',
              marginLeft: 0,
              marginRight: 0,
              border: 'none',
              paddingTop: 8
            }}
          >
            <ButtonGroup align="center">
              <Button onClick={handleSave} loading={saveLoading}>
                保存
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                提交
              </Button>
            </ButtonGroup>
          </div>
        </Card>
      </Form>
    </div>
  )
}

export default Form.create({
  onValuesChange: (props, changedValues, v) => {
    const changedFields = Object.keys(changedValues)
    const { setFieldsValue } = props.form
    const {
      finDebtAmount, // 负债总额
      finAssetAmount, // 资产总额
      finFlowAsset, // 流动资产
      finFlowDebt, //流动负债
      finStock, // 库存
      finCost, // 销售/营业成本
      finAvgStock //平均库存
    } = v
    let needChange = false

    // 资产负债率 = 负债总额 ÷ 资产总额
    const finAssetDebtRate = test(finDebtAmount / finAssetAmount)
    // 流动比率 = 流动资产 ÷ 流动负债
    const finFlowRate = test(finFlowAsset / finFlowDebt)
    // 速动比率 = ( 流动资产 － 库存 ) ÷ 流动负债
    const finQuickRate = test((finFlowAsset - finStock) / finFlowDebt)
    // 存货周转率 = 销售 ( 营业 ) 成本 ÷ 平均存货
    const finTurnoverRate = test(finCost / finAvgStock)

    const testFields = ['finAssetDebtRate', 'finFlowRate', 'finQuickRate', 'finTurnoverRate']
    testFields.forEach((f) => {
      if (!changedFields.includes(f)) {
        needChange = true
      }
    })
    if (needChange) {
      setFieldsValue({
        finAssetDebtRate,
        finFlowRate,
        finQuickRate,
        finTurnoverRate
      })
    }
  }
})(Business)

function test(n) {
  n = n * 100
  if (!isNaN(n) && n !== Infinity) {
    return n.toFixed(2)
  } else {
    return ''
  }
}

// 去除空数据
function encode(values) {
  Object.keys(values).forEach((key) => {
    if (isEmpty(values[key])) {
      delete values[key]
    }
  })

  return values
}
