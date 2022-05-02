import React from 'react'
import D from '@/components/DescriptionList'
import DownloadItem from '@/components/DownloadItem'
import { formatMoney } from '@/utils'
import { Icon } from 'antd'
import { useSelector } from 'react-redux'
import Card from '@/components/Card'
// import AssetsTitle from './AssetsTitle'
import Wrap from '../Wrap'
import AssetsInfo from '../AssetsInfo'

const { Description: I } = D

const FinanceInfo = ({ data, hideVerifyFiles = false }) => {
  const codes = useSelector(({ authorities }) => authorities.button.buttons)

  return (
    <React.Fragment>
      <Wrap title="担保申请信息">
        <D>
          <I label="申请担保金额(元)">{formatMoney(data.applyFinanceAmount)}</I>
          <I label="预计还款日">{data.paymentDate}</I>
          <I label="上一年度营业额(元)">{formatMoney(data.lastYearProfit)}</I>
          <I label="上一年度税务报表净利润 (元)">{formatMoney(data.lastYearBizAmount)}</I>
          <I label="放款账号">{data.bankAccount}</I>
          <I label="开户银行">{data.bankSiteName}</I>
          <I label="开户省市">
            {data.bankProvince} {data.bankCity}
          </I>
          <I label="所属支行">{data.bankBranch}</I>
          <I label="资金用途" whole>
            {data.financePurpose}
          </I>
          <I label="担保申请表" whole>
            <DownloadItem list={data.guaranteeFiles || []} />
          </I>
          <I label="授权协议" whole>
            <DownloadItem list={data.authorizeFiles || []} />
          </I>
          <I label="审计报告/财务报表" whole>
            <DownloadItem list={data.auditFiles || []} />
          </I>
          <I label="纳税凭证" whole>
            <div style={{ position: 'relative', maxWidth: 600 }}>
              <DownloadItem list={data.payTaxesFiles || []} />
              {codes.includes('融资管理-详情页-去验证-国投') && (
                <div
                  style={{ position: 'absolute', left: 'calc(100% + 2px)', top: 10, width: 200 }}
                >
                  <a
                    href="https://etax.ningbo.chinatax.gov.cn/nbdzswj-web/apps/views/beforeLogin/indexBefore/pageIndex.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: 10 }}
                  >
                    去验证
                    <Icon type="double-right" style={{ fontSize: '12px' }} theme="outlined" />
                  </a>
                </div>
              )}
            </div>
          </I>

          {/* <I label="对账单流水" whole>
          <DownloadItem list={data.bankFlowFiles || []} />
        </I> */}
          <I label="身份证明" whole>
            <DownloadItem list={data.IdentifyFiles || []} />
          </I>
          {/* <I label="企业征信" whole>
          <DownloadItem list={data.orgCreditFiles || []} />
        </I>
        <I label="个人征信" whole>
          <DownloadItem list={data.creditFiles || []} />
        </I>
        <I label="购销合同" whole>
          <DownloadItem list={data.agreementFiles || []} />
        </I>
        <I label="租赁合同" whole>
          <DownloadItem list={data.rentFiles || []} />
        </I>
        <I label="产权证明" whole>
          <DownloadItem list={data.ownerFiles || []} />
        </I>
        <I label="抵押信息" whole>
          <DownloadItem list={data.mortgageFiles || []} />
        </I> */}
          <I label="信用卡记录" whole>
            <DownloadItem list={data.creditRecordFiles || []} />
          </I>
          <I label="办公场地租赁" whole>
            <DownloadItem list={data.orgRentFiles || []} />
          </I>
          <I label="水电使用情况" whole>
            <DownloadItem list={data.orgOfficeFiles || []} />
          </I>
        </D>
      </Wrap>
      <Card.SubCard title="对账单流水">
        <D>
          <I label="对公流水" whole>
            <DownloadItem list={data.orgFlowFiles || []} />
          </I>
          <I label="个人流水" whole>
            <DownloadItem list={data.personFlowFiles || []} />
          </I>
        </D>
      </Card.SubCard>
      <Card.SubCard title="征信">
        <D>
          <I label="企业征信" whole>
            <DownloadItem list={data.orgCreditFiles || []} />
          </I>
          <I label="个人征信" whole>
            <DownloadItem list={data.personCreditFiles || []} />
          </I>
        </D>
      </Card.SubCard>
      {/* <Card.SubCard title="资产信息">
        {data?.orgAssets ? (
          <React.Fragment>
            <div
              style={{
                marginLeft: 125,
                color: 'rgba(0, 0, 0, 0.85)',
                fontWeight: 500,
                fontSize: 16
              }}
            >
              企业资产
            </div>
            {data?.orgAssets &&
              data?.orgAssets?.map((item, index) => (
                <React.Fragment key={DownloadItem}>
                  <AssetsTitle>企业资产{index + 1}</AssetsTitle>
                  <D>
                    <I label="资产类型" whole>
                      {item.propertyType}
                    </I>
                    <I label="资产证明" whole>
                      <DownloadItem list={item.propertyCertificateFiles || []} />
                    </I>
                    <I label="是否抵押" whole>
                      {item.isMortgaged}
                    </I>
                    {item.isMortgaged === '是' && (
                      <I label="抵押信息" whole>
                        <DownloadItem list={item.mortgageFiles || []} />
                      </I>
                    )}
                  </D>
                </React.Fragment>
              ))}
          </React.Fragment>
        ) : (
          <div style={{ marginBottom: 40 }}>
            <span
              style={{
                marginLeft: 125,
                color: 'rgba(0, 0, 0, 0.85)',
                fontWeight: 500,
                fontSize: 16
              }}
            >
              企业资产
            </span>
            <span
              style={{
                marginLeft: 25,
                color: 'rgba(0, 0, 0, 0.65)',
                fontWeight: 400,
                fontSize: 16
              }}
            >
              无
            </span>
          </div>
        )}
        {data?.personAssets ? (
          <React.Fragment>
            <div
              style={{
                marginLeft: 125,
                color: 'rgba(0, 0, 0, 0.85)',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              个人资产
            </div>
            {data?.personAssets &&
              data?.personAssets?.map((item, index) => (
                <React.Fragment key={item}>
                  <AssetsTitle>个人资产{index + 1}</AssetsTitle>
                  <D>
                    <I label="资产类型" whole>
                      {item.propertyType}
                    </I>
                    <I label="资产证明" whole>
                      <DownloadItem list={item.propertyCertificateFiles || []} />
                    </I>
                    <I label="是否抵押" whole>
                      {item.isMortgaged}
                    </I>
                    {item.isMortgaged === '是' && (
                      <I label="抵押信息" whole>
                        <DownloadItem list={item.mortgageFiles || []} />
                      </I>
                    )}
                  </D>
                </React.Fragment>
              ))}
          </React.Fragment>
        ) : (
          <div style={{ marginBottom: 40 }}>
            <span
              style={{
                marginLeft: 125,
                color: 'rgba(0, 0, 0, 0.85)',
                fontWeight: 500,
                fontSize: 16
              }}
            >
              个人资产
            </span>
            <span
              style={{
                marginLeft: 25,
                color: 'rgba(0, 0, 0, 0.65)',
                fontWeight: 400,
                fontSize: 16
              }}
            >
              无
            </span>
          </div>
        )}
      </Card.SubCard> */}
      <Card.SubCard title="资产信息">
        <AssetsInfo data={data} />
      </Card.SubCard>
      <Card.SubCard title="借款情况">
        <D>
          <I label="企业借款情况" whole>
            {data?.orgLoanInfo?.length !== 0
              ? data?.orgLoanInfo?.map((item, index) => (
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{ color: 'rgba(25, 137, 170, 1)', fontSize: '16px', marginRight: 5 }}
                    >
                      {index + 1}
                    </div>
                    <div>{item}</div>
                  </div>
                ))
              : '无'}
          </I>
          <I label="个人借款情况" whole>
            {data?.personLoanInfo?.length !== 0
              ? data?.personLoanInfo?.map((item, index) => (
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{ color: 'rgba(25, 137, 170, 1)', fontSize: '16px', marginRight: 5 }}
                    >
                      {index + 1}
                    </div>
                    <div>{item}</div>
                  </div>
                ))
              : '无'}
          </I>
        </D>
      </Card.SubCard>
      <Card.SubCard>
        <D>
          <I label="其他材料" whole>
            <DownloadItem list={data.otherFinanceFiles || []} />
          </I>
        </D>
      </Card.SubCard>

      <Wrap title="反担保信息">
        <D>
          <I label="反担保企业全称">{data.cgOrg}</I>
          <I label="营业执照" whole>
            <DownloadItem list={data.cgOrgLicenseFiles || []} />
          </I>
          <I label="审计报告/财务报表" whole>
            <DownloadItem list={data.cgAuditFiles || []} />
          </I>
          <I label="企业身份证明" whole>
            <DownloadItem list={data.cgOrgIdentifyFiles || []} />
          </I>
          <I label="其他反担保企业材料" whole>
            <DownloadItem list={data.cgOrgOtherFiles || []} />
          </I>
        </D>
      </Wrap>
      <Card.SubCard>
        <D>
          <I label="反担保个人姓名" whole>
            {data.cgPersonName}
          </I>
          <I label="个人身份证明" whole>
            <DownloadItem list={data.cgIdentifyFiles || []} />
          </I>
          <I label="其他反担保个人材料" whole>
            <DownloadItem list={data.cgOtherFiles || []} />
          </I>
        </D>
      </Card.SubCard>
    </React.Fragment>
  )
}

export default FinanceInfo
