import React from 'react'
import styles from './styles.less'
import { Icon, Button, message, Alert, Spin } from 'antd'
import { useRequest } from '@dragon/hooks'
import { fetchReport, generateReport } from '@/services/microSubsidy/enterprise'
import ButtonGroup from '@/components/ButtonGroup'
import Link from 'umi/link'

const reportTypeMap = {
  RISK_REPORT: {
    title: '风控评分',
    generateAuth: '融资管理-详情页-风控报告-初次生成-国投',
    reGenerateAuth: '融资管理-详情页-风控报告-重新生成-国投',
    checkAuth: '融资管理-详情页-查看风控报告-国投',
    to: '/report/risk'
  }
}

// bizNo
// reportType: FRAUD_REPORT RISK_REPORT MONITOR_REPORT
// hideAction // true时隐藏按钮
let toasted = false
const RiskCard = ({ reportType, bizNo, toggle, hideAction, data, style }) => {
  const map = reportTypeMap[reportType] || {}

  // 获取报告详情
  const { data: report = {}, start: fetchReportReq, loading: fetchLoading } = useRequest(
    () =>
      fetchReport({
        bizNo,
        reportType
      }),
    {
      onSuccess: (res) => {
        if (res.toastType === '生成失败' && !toasted) {
          message.error(res.toastMessage)
          toasted = true
          toggle && toggle(false)
        }
        if (res.status === '已生成') {
          toggle && toggle(false)
        }
        if (res.onCreating === true) {
          toggle && toggle(true)
          setTimeout(() => fetchReportReq(), 5000)
        }
      }
    }
  )

  // 生成报告
  const { loading, start: generate } = useRequest(
    () =>
      generateReport({
        bizNo,
        reportType
      }),
    {
      manual: true,
      onSuccess: () => {
        fetchReportReq()
      }
    }
  )

  return (
    <Spin spinning={fetchLoading}>
      <div className={styles.riskCard} style={style}>
        {/* 标题和时间 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
            <div className={styles.title}>{map.title}</div>
            {report.status === '已生成' && (
              <div style={{ marginLeft: 18 }}>
                <ButtonGroup type="action">
                  <Button auth={map.checkAuth} type="link" style={{ fontSize: 12 }}>
                    <Link to={`${map.to}/${bizNo}`} target="_blank">
                      查看报告
                      <Icon
                        type="double-right"
                        style={{ fontSize: 10, marginLeft: 2 }}
                        theme="outlined"
                      />
                    </Link>
                  </Button>
                  {!hideAction && !report.onCreating && (
                    <Button
                      auth={map.reGenerateAuth}
                      onClick={generate}
                      loading={loading}
                      type="link"
                      style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}
                    >
                      重新生成
                      <Icon type="redo" style={{ fontSize: 10, marginLeft: 2 }} />
                    </Button>
                  )}
                </ButtonGroup>
              </div>
            )}
            {report.status === '生成失败' && (
              <div style={{ marginLeft: 18 }}>
                <ButtonGroup type="action">
                  {!hideAction && report.creatable && (
                    <Button
                      auth={map.reGenerateAuth}
                      onClick={generate}
                      loading={loading}
                      style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                    >
                      重新生成
                      <Icon type="redo" />
                    </Button>
                  )}
                </ButtonGroup>
              </div>
            )}
          </div>
          {report.createTime && (
            <div className={styles.time}>{`生成时间：${report.createTime} `}</div>
          )}
        </div>
        {/* 提示 */}
        {report.status === '待生成' && (
          <>
            <div style={{ margin: '16px 0' }} className={styles.time}>
              待生成
            </div>
          </>
        )}
        {report.status === '生成中' && (
          <>
            <div style={{ margin: '16px 0' }} className={styles.time}>
              生成中...
            </div>
            <div className={styles.time}>*预计2分钟后完成，生成完才可审批</div>
          </>
        )}
        {report.status === '已生成' && (
          <>
            <div className={styles.content}>
              {report?.score}
              {report.toastType === '生成中' && (
                <Alert className={styles.alert} message="最新报告生成中" type="warning" showIcon />
              )}
              {report.toastType === '生成失败' && (
                <Alert
                  className={styles.alert}
                  message="最新报告生成失败！如有疑问请联系 155957166503"
                  type="error"
                  showIcon
                />
              )}
            </div>
            {/* <div>
              <ButtonGroup type="action">
                <Button auth={map.checkAuth} type="link">
                  <Link to={`${map.to}/${bizNo}`} target="_blank">
                    查看报告{' '}
                    <Icon type="double-right" style={{ fontSize: '12px' }} theme="outlined" />
                  </Link>
                </Button>
                {!hideAction && !report.onCreating && (
                  <Button
                    auth={map.reGenerateAuth}
                    onClick={generate}
                    loading={loading}
                    type="link"
                    style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                  >
                    重新生成
                    <Icon type="redo" />
                  </Button>
                )}
              </ButtonGroup>
            </div> */}
          </>
        )}
        {report.status === '生成失败' && (
          <>
            <div
              style={{ color: 'rgba(245,34,45,1)', fontSize: 15, marginTop: 10, marginBottom: 7 }}
            >
              生成失败
            </div>
            <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
              提示：如有疑问请联系 155957166503
            </div>
            {/* <ButtonGroup type="action">
              {!hideAction && report.creatable && (
                <Button
                  auth={map.reGenerateAuth}
                  onClick={generate}
                  loading={loading}
                  style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                >
                  重新生成
                  <Icon type="redo" />
                </Button>
              )}
            </ButtonGroup> */}
          </>
        )}
      </div>
    </Spin>
  )
}

export default RiskCard
