import React from 'react'
import styles from './styles.less'
import { Icon, Button, message, Alert, Popover } from 'antd'
import { useRequest } from '@dragon/hooks'
import { fetchReport, generateReport } from '@/services/microSubsidy/enterprise'
import ButtonGroup from '@/components/ButtonGroup'
import Link from 'umi/link'

const reportTypeMap = {
  FRAUD_REPORT: {
    title: '反欺诈报告',
    generateAuth: '融资管理-详情页-反欺诈-初次生成-国投',
    reGenerateAuth: '融资管理-详情页-反欺诈-重新生成-国投',
    checkAuth: '融资管理-详情页-查看反欺诈报告-国投',
    to: '/report/af'
  },
  RISK_REPORT: {
    title: '风控报告',
    generateAuth: '融资管理-详情页-风控报告-初次生成-国投',
    reGenerateAuth: '融资管理-详情页-风控报告-重新生成-国投',
    checkAuth: '融资管理-详情页-查看风控报告-国投',
    to: '/report/risk'
  },
  MONITOR_REPORT: {
    title: '最新预警因子',
    to: '/report/monitor'
  },
  info: {
    title: '信息完善分',
    generateAuth: '融资管理-详情页',
    reGenerateAuth: '融资管理-详情页',
    checkAuth: '融资管理-详情页'
  },
  total: {
    title: '综合评分',
    generateAuth: '融资管理-详情页',
    reGenerateAuth: '融资管理-详情页',
    checkAuth: '融资管理-详情页'
  }
}

// bizNo
// reportType: FRAUD_REPORT RISK_REPORT MONITOR_REPORT
// hideAction // true时隐藏按钮
let toasted = false
const RiskCard = ({ reportType, bizNo, toggle, hideAction, fetchPerfection, data, style }) => {
  const map = reportTypeMap[reportType] || {}

  // 获取报告详情
  const { data: report = {}, start: fetchReportReq } = useRequest(
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
        }
        if (res.status === '已生成') {
          fetchPerfection && fetchPerfection()
          toggle && toggle(false)
        }
        if (res.onCreating === true) {
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
    <div className={styles.riskCard} style={style}>
      {/* 标题和时间 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className={styles.title}>
          {map.title}
          {map.title === '综合评分' ? (
            <Popover content="由信息完善分、反欺诈评分和风控评分综合得出">
              <Icon type="question-circle" className={styles.icon} />
            </Popover>
          ) : (
            ''
          )}
        </span>
        {report.createTime && (
          <span className={styles.time}>
            {`生成时间：${report.createTime} `}
            {map.title === '最新预警因子' ? '自动更新' : ''}
          </span>
        )}
      </div>
      {/* 提示 */}
      {report.status === '待生成' && (
        <>
          {data?.status === '已生成' ? (
            <>
              <div className={styles.content}>{data?.score || report?.score}</div>
            </>
          ) : (
            <>
              <div style={{ margin: '16px 0' }} className={styles.time}>
                待生成
              </div>
              <ButtonGroup>
                {!hideAction && report.creatable && (
                  <Button
                    auth={map.generateAuth}
                    onClick={generate}
                    loading={loading}
                    type="primary"
                  >
                    立即生成
                  </Button>
                )}
              </ButtonGroup>
            </>
          )}
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
            {data?.score || report?.score}
            {report.toastType === '生成中' && (
              <Alert className={styles.alert} message="最新报告生成中" type="warning" showIcon />
            )}
            {report.toastType === '生成失败' && (
              <Alert className={styles.alert} message="最新报告生成失败" type="error" showIcon />
            )}
          </div>
          <div>
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
          </div>
        </>
      )}
      {report.status === '生成失败' && (
        <>
          <div style={{ color: 'red' }}>生成失败</div>
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
        </>
      )}
    </div>
  )
}

export default RiskCard
