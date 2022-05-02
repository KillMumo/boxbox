import React from 'react'
import D from '@/components/DescriptionList'
import DownloadItem from '@/components/DownloadItem'
import { formatMoney } from '@/utils'
import Card from '@/components/Card'
import { Empty } from 'antd'
import Wrap from '../Wrap'

const { Description: I } = D

const BusinessInfo = ({ data, info }) => {
  const isEmpty = (num) => {
    if (num) {
      return formatMoney(num)
    } else return '无'
  }
  return (
    <React.Fragment>
      {Object.keys(data).length > 0 ? (
        <React.Fragment>
          <Wrap title="业务评估信息">
            <Card.SubCard title="财务信息">
              <D>
                <I label="负债总额(元)">{isEmpty(data.finDebtAmount)}</I>
                <I label="资产总额(元)">{isEmpty(data.finAssetAmount)}</I>
                <I label="资产负债率" whole>
                  {data.finAssetDebtRate ? data.finAssetDebtRate + '%' : '无'}
                </I>
                <I label="流动资产(元)">{isEmpty(data.finFlowAsset)}</I>
                <I label="流动负债(元)">{isEmpty(data.finFlowDebt)}</I>
                <I label="流动比率" whole>
                  {data.finFlowRate ? data.finFlowRate + '%' : '无'}
                </I>
                <I label="库存(元)">{isEmpty(data.finStock)}</I>
                <I label="速动比率" whole>
                  {data.finQuickRate ? data.finQuickRate + '%' : '无'}
                </I>
                <I label="销售/营业成本(元)">{isEmpty(data.finCost)}</I>
                <I label="平均存货(元)">{isEmpty(data.finAvgStock)}</I>
                <I label="存货周转率">{data.finTurnoverRate ? data.finTurnoverRate + '%' : '无'}</I>
              </D>
            </Card.SubCard>
            <Card.SubCard title="纳税信息" style={{ marginTop: 24 }}>
              <D>
                <I label="累计实缴金额(元)">{isEmpty(data.taxAmount)}</I>
              </D>
            </Card.SubCard>
            <Card.SubCard title="信用卡信息" style={{ marginTop: 24 }}>
              <D>
                <I label="月平均消费金额(元)">{isEmpty(data.creditAvgAmount)}</I>
                <I label="逾期次数">{data.creditDueCount}</I>
              </D>
            </Card.SubCard>
            <Card.SubCard title="对账单流水" style={{ marginTop: 24 }}>
              <div
                style={{
                  marginLeft: 115,
                  marginTop: 12,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                对公流水
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="近一年收支差额(元)">{isEmpty(data.orgFlowAmount)}</I>
                <I label="月均收支差额(元)">{isEmpty(data.orgFlowAvgAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                个人流水
              </div>
              <D>
                <I label="近一年收支差额(元)">{isEmpty(data.personFlowAmount)}</I>
                <I label="月均收支差额(元)">{isEmpty(data.personFlowAvgAmount)}</I>
              </D>
            </Card.SubCard>
            <Card.SubCard title="征信" style={{ marginTop: 24 }}>
              <div
                style={{
                  marginLeft: 115,
                  marginTop: 12,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                企业征信
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="在贷总额(元)">{isEmpty(data.orgCreditAmount)}</I>
                <I label="不良/违约总额(元)">{isEmpty(data.orgCreditDueAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                个人征信
              </div>
              <D>
                <I label="在贷总额(元)">{isEmpty(data.personCreditAmount)}</I>
                <I label="不良/违约总额(元)">{isEmpty(data.personCreditDueAmount)}</I>
              </D>
            </Card.SubCard>
            <Card.SubCard title="资产信息" style={{ marginTop: 24 }}>
              <div
                style={{
                  marginLeft: 115,
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: 500,
                  fontSize: 16
                }}
              >
                企业资产
              </div>
              <div
                style={{
                  marginLeft: 115,
                  marginTop: 12,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                房产
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="市场预估总价(元)">{isEmpty(data.orgAssetsHouseAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.orgAssetsHouseMortgageAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                车辆
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="市场预估总价(元)">{isEmpty(data.orgAssetsCarAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.orgAssetsCarMortgageAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                其他
              </div>
              <D>
                <I label="市场预估总价(元)">{isEmpty(data.orgAssetsOtherAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.orgAssetsOtherMortgageAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginTop: 0,
                  color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: 500,
                  fontSize: 16
                }}
              >
                个人资产
              </div>
              <div
                style={{
                  marginLeft: 115,
                  marginTop: 12,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                房产
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="市场预估总价(元)">{isEmpty(data.personAssetsHouseAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.personAssetsHouseMortgageAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                车辆
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="市场预估总价(元)">{isEmpty(data.personAssetsCarAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.personAssetsCarMortgageAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                其他
              </div>
              <D>
                <I label="市场预估总价(元)">{isEmpty(data.personAssetsOtherAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.personAssetsOtherMortgageAmount)}</I>
              </D>
            </Card.SubCard>
            {/* <Card.SubCard title="个人资产信息">
              <div
                style={{
                  marginLeft: 115,
                  marginTop: 12,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                房产
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="市场预估总价(元)">{isEmpty(data.personAssetsHouseAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.personAssetsHouseMortgageAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                车辆
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="市场预估总价(元)">{isEmpty(data.personAssetsCarAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.personAssetsCarMortgageAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                其他
              </div>
              <D>
                <I label="市场预估总价(元)">{isEmpty(data.personAssetsOtherAmount)}</I>
                <I label="抵押总额(元)">{isEmpty(data.personAssetsOtherMortgageAmount)}</I>
              </D>
            </Card.SubCard> */}
            <Card.SubCard title="借款情况" style={{ marginTop: 24 }}>
              <div
                style={{
                  marginLeft: 115,
                  marginTop: 12,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                企业借款情况
              </div>
              <D style={{ marginBottom: 0 }}>
                <I label="借款总额(元)">{isEmpty(data.orgLoanAmount)}</I>
              </D>
              <div
                style={{
                  marginLeft: 115,
                  marginBottom: 12,
                  fontSize: 14,
                  color: 'rgba(0, 0, 0, 0.45)'
                }}
              >
                个人借款情况
              </div>
              <D>
                <I label="借款总额(元)">{isEmpty(data.personLoanAmount)}</I>
              </D>
            </Card.SubCard>
          </Wrap>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Wrap title="业务评估信息"></Wrap>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </React.Fragment>

        // <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {info.verifyFiles && (
        <Wrap title="尽职报告信息">
          <D>
            <I label="申请企业审核审批表" whole>
              <DownloadItem list={info.verifyFiles || []} />
            </I>
            <I label="反担保企业审核审批表" whole>
              <DownloadItem list={info.verifyCgVerifyFiles || []} />
            </I>
            <I label="会议记录" whole>
              <DownloadItem list={info.verifyMeetingFiles || []} />
            </I>
            <I label="其他尽职报告材料" whole>
              <DownloadItem list={info.verifyOtherFiles || []} />
            </I>
          </D>
        </Wrap>
      )}
    </React.Fragment>
  )
}

export default BusinessInfo
