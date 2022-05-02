import React, { useState, useEffect } from 'react'
import { Tag, Spin } from 'antd'
import CardDetail from '../Components/CardDetail'
import { fetchReportDetail } from '@/services/microSubsidy/report'
import styles from '../styles.less'

const ReportDetail = (props) => {
  const {
    location: {
      query: { detailType, id, Name = '', ActionRemark = '' }
    }
  } = props

  const [detail, setDetail] = useState({})
  const [PartyInfo, setPartyInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // 处理当事人数据
  const handleData = (data) => {
    let str = data.replace(/↵/g, '')
    const arr = str.split('。')
    // arr.map((item, index) => {
    //   console.log(index, item)
    // })
    // let pos = ''
    // for (const [index, value] of arr.entries()) {
    //   console.log(value)
    //   if (value.indexOf('被告') > -1) {
    //     pos = index
    //     break
    //   } else if (value.indexOf('被申请人') > -1) {
    //     pos = index
    //     break
    //   }
    // }
    arr.splice(arr.length - 1, 1)
    setPartyInfo({
      arr: arr
    })
  }

  // 处理html返回值
  const handleHtml = (str) => {
    if (str) {
      str = str.replace(new RegExp(`font-family.*?;`, 'gm'), 'font-family: 宋体')
      str = str.replace(new RegExp(`<a.*?>`, 'gm'), '')
      str = str.replace(new RegExp(`</a>.*?`, 'gm'), '')
      str = str.replace(new RegExp(`font-size.*?;`, 'gm'), 'font-size: 16px')
      return str.replace(new RegExp(`color.*?;`, 'gm'), 'color:black')
    }
  }

  // 处理裁判文书空格
  const handleCpws = (str) => {
    if (str) {
      str = str.replace(/\s+/g, '')
      str = str.replace(/&nbsp;/g, '')
      str = str.replace(/&lt;/g, '')
      str = str.replace(/&gt;/g, '')
    }
    return str
  }

  // 无数据处理
  const isEmpty = (str) => {
    return str && str !== ' ' ? str : '暂无'
  }

  useEffect(() => {
    setIsLoading(true)
    fetchReportDetail({ detailType: detailType, id: id }).then((res) => {
      setIsLoading(false)
      if (res instanceof Error) return
      setDetail(res.detail)
      if (res.detail.PartyInfo) {
        handleData(res.detail.PartyInfo)
      }
    })
  }, [id, detailType])

  // 渲染裁判文书
  const renderCpws = () => {
    return (
      <div>
        <div>
          <div className={styles.cpwsTitle}>{detail.CaseName}</div>
          <div className={styles.cpwsTime}>
            <span style={{ marginRight: 30 }}>编号：{detail.CaseNo}</span>
            <span>创建时间：{detail.CreateDate}</span>
          </div>
          <div style={{ marginBottom: 30 }}>
            {detail.CaseType && <Tag color="blue">{detail.CaseType}</Tag>}
            {detail.Court && (
              <Tag color="blue" style={{ marginRight: 13 }}>
                {detail.Court}
              </Tag>
            )}
            {detail.CaseReason && (
              <Tag color="blue" style={{ marginRight: 13 }}>
                {detail.CaseReason}
              </Tag>
            )}
            {detail.TrialRound && (
              <Tag color="orange" style={{ marginRight: 13 }}>
                {detail.TrialRound}
              </Tag>
            )}
          </div>
        </div>
        <CardDetail
          title="当事人"
          desc={
            PartyInfo.arr &&
            PartyInfo.arr.map((item) => {
              return (
                <div>
                  <div className={styles.cpwsDetail}>{isEmpty(item)}</div>
                </div>
              )
            })
          }
        ></CardDetail>
        <CardDetail title="审理经过" desc={isEmpty(handleCpws(detail.TrialProcedure))}></CardDetail>
        <CardDetail
          title="原告诉求"
          desc={isEmpty(handleCpws(detail.PlaintiffRequest))}
        ></CardDetail>
        <CardDetail title="被告答辩" desc={isEmpty(handleCpws(detail.DefendantReply))}></CardDetail>
        <CardDetail title="本院查明" desc={isEmpty(handleCpws(detail.CourtInspect))}></CardDetail>
        <CardDetail title="本院认为" desc={isEmpty(handleCpws(detail.CourtConsider))}></CardDetail>
        <CardDetail title="判决结果" desc={isEmpty(handleCpws(detail.JudgeResult))}></CardDetail>
        <CardDetail title="合议庭" desc={isEmpty(detail.CollegiateBench)}></CardDetail>
        <CardDetail title="记录员" desc={isEmpty(detail.Recorder)}></CardDetail>
        <CardDetail title="裁定日期" desc={isEmpty(handleCpws(detail.Judege_Date))}></CardDetail>
      </div>
    )
  }

  const renderDetail = () => {
    switch (detailType) {
      case 'cpws':
        return renderCpws()
      case 'sfpm':
        return (
          <div>
            <div className={styles.cpwsTitle}>{Name}</div>
            <div className={styles.cpwsTime}>
              <span>拍卖时间：{ActionRemark}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: handleHtml(detail.Context) }} />
          </div>
        )

      default:
        break
    }
  }

  return (
    <Spin spinning={isLoading}>
      <div className={styles.reportDetail}>{renderDetail()}</div>
    </Spin>
  )
}

export default ReportDetail
