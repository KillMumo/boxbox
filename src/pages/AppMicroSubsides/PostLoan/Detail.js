import React, { useCallback, useState, useEffect } from 'react'
import { Button, message, Icon, Tag, Timeline, Empty } from 'antd'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import ButtonGroup from '@/components/ButtonGroup'
import TimelineBiz from '@/components/Timeline/TimelineBiz'
import { useRequest } from '@dragon/hooks'
import {
  fetchDetail,
  agree,
  getCompanyDetail,
  fetchBusiness
} from '@/services/microSubsidy/finance'
import { submitFormOutFlow, fetchFormOutFlow } from '@/services/common'
import { formatMoney, windowOpen } from '@/utils'
import IconFont from '@/components/IconFont'
import PayBackForm from '../components/ModalForms/PayBackForm'
import OutDate from '../components/ModalForms/OutDate'
import PostLoanReport from '../components/ModalForms/PostLoanReport'
import useModalForm from '@/hooks/useModalForm'
import router from 'umi/router'
// import CompanyInfo from '../components/CompanyInfo'
import FinanceInfo from '../components/FinanceInfo'
import PostLoanInfo from '../components/PostLoanInfo'
import PayInfo from '../components/PayInfo'
import { financeStatus } from '../common/dict'
// import RiskCardList from '../components/RiskCardList'
// import {
//   fetchDetail as fetchCmyDetail,
//   fetchSupplyDealerTopology
// } from '@/services/microSubsidy/enterprise'
import { fetchReport } from '@/services/microSubsidy/enterprise'
import { warning } from '../common/dict'
import styles from './styles.less'

// import SupplyRelationList from '../components/SupplyRelationList'
import Link from 'umi/link'
import G6 from '@antv/g6'
import BusinessInfo from '../components/BusinessInfo'
import RiskMarkList from '../components/RiskMarkList'
import SupplyRelationInfo from '../components/SupplyRelationInfo'
import Suspense from '@/components/Suspense'

const { Description } = DescriptionList

// const { TabPane } = Tabs

const getTabList = (show) =>
  [
    show && { key: '1', tab: '保后信息' },
    { key: '2', tab: '放款信息' },
    { key: '3', tab: '担保信息' },
    { key: '4', tab: '评估信息' },
    { key: '5', tab: '企业信息' }
  ].filter((i) => i)

const CompanyInfo = React.lazy(() => import('../components/CompanyInfo'))

const Detail = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  const [isFold, setIsFold] = useState(true)

  // 修改收起||展开状态
  const handleFold = () => {
    setIsFold(!isFold)
  }

  // 获取预警信息
  // const { data: warningInfo = {} } = useRequest(() =>
  //   fetchReportList(
  //     { bizNo: id, reportType: 'MONITOR_REPORT' },
  //     {
  //       onSuccess: () => {}
  //     }
  //   )
  // )
  // 获取预警信息
  const { data: warningInfo = {} } = useRequest(() =>
    fetchReport(
      { bizNo: id, reportType: 'MONITOR_REPORT' },
      {
        onSuccess: () => {}
      }
    )
  )

  // 获取综合分
  // const { data: perfection = {}, start: fetchPerfectionReq } = useRequest(
  //   () =>
  //     fetchReport({
  //       bizNo: id,
  //       reportType: 'total'
  //     }),
  //   {
  //     // manual: true,
  //     onSuccess: () => {
  //       console.log('safsafas')
  //     }
  //   }
  // )

  // 获取企业供销关系图
  // const { data: graphData = {}, start: fetchSupplyDealerTopologyReq } = useRequest(
  //   fetchSupplyDealerTopology,
  //   {
  //     manual: true
  //   }
  // )

  // 获取企业详情
  const { data = {}, start: fetchCmyDetailReq } = useRequest(getCompanyDetail, {
    manual: true,
    onSuccess: (res) => {
      // fetchSupplyDealerTopologyReq({ orgName: res.companyBasicInfoVO.orgName })
    }
  })

  // 获取业务评估数据
  const { data: businessData = {}, start: fetchBusinessReq } = useRequest(fetchBusiness, {
    manual: true
  })

  // 获取融资详情
  const { data: info = {}, loading: fetching } = useRequest(() => fetchDetail({ bizNo: id }), {
    onSuccess: (res) => {
      fetchCmyDetailReq({ bizNo: id })
      fetchBusinessReq({ bizNo: id })
    }
  })

  const { data: formList = [] } = useRequest(() =>
    fetchFormOutFlow({
      bizNo: id,
      formKey: '上传贷后报告',
      formName: '上传贷后报告'
    })
  )
  // const showFirstTab = !!(info.extra?.payForm || formList.length)
  const showFirstTab = info?.extra?.payPayBackNum || formList.length

  const [activeKey, setActiveKey] = useState(showFirstTab ? '1' : '2')
  useEffect(() => {
    setActiveKey(showFirstTab ? '1' : '2')
  }, [formList.length, info.extra, showFirstTab])

  const tab = {
    '1': () => (
      <PostLoanInfo data={info?.extra?.payPayBackNum && info?.extra} list={formList || {}} />
    ),
    '2': () => <PayInfo data={info.extra || {}} />,
    '3': () => <FinanceInfo data={info.extra || {}} />,
    '4': () => <BusinessInfo data={businessData.data} info={info.extra} />,
    '5': () => (
      <Suspense>
        <CompanyInfo hideAdmin hideSupply data={data || {}} />
      </Suspense>
    )
  }

  // 还款表单
  const { loading: payBackLoading, start: payBackReq } = useRequest(agree, { manual: true })
  const { open: openPayBackForm, props: payBackProps } = useModalForm({
    info: info,
    title: '还款',
    payAmount: info.extra?.loanPayAmount, // 放款金额传入form
    confirmLoading: payBackLoading,
    afterValidate: async (v, close) => {
      const res = await payBackReq({
        taskName: info.currentTask,
        processId: info.processId,
        ...v
      })
      if (res instanceof Error) return
      message.success('还款成功')
      window.location.reload()
    }
  })

  // 逾期表单
  const { loading: outDateLoading, start: outDateReq } = useRequest(agree, { manual: true })
  const { open: openOutDateForm, props: outDateProps } = useModalForm({
    title: '确认逾期',
    confirmLoading: outDateLoading,
    afterValidate: async (v, close) => {
      const res = await outDateReq({
        taskName: '确认逾期',
        processId: info.processId,
        ...v
      })
      if (res instanceof Error) return
      message.success('确认逾期成功')
      window.location.reload()
    }
  })

  // 上传贷后报告表单
  const { loading: postLoanLoading, start: postLoanReq } = useRequest(submitFormOutFlow, {
    manual: true
  })
  const { open: openPostLoanForm, props: postLoanProps } = useModalForm({
    title: '上传保后报告',
    confirmLoading: postLoanLoading,
    afterValidate: async (v, close) => {
      const res = await postLoanReq({
        bizNo: id,
        formName: '上传贷后报告',
        formKey: '上传贷后报告',
        ...v
      })
      if (res instanceof Error) return
      message.success('上传保后报告成功')
      window.location.reload()
    }
  })

  // 所有的弹出框表单
  const renderForm = () => {
    return (
      <React.Fragment>
        <PayBackForm {...payBackProps} />
        <OutDate {...outDateProps} />
        <PostLoanReport {...postLoanProps} />
      </React.Fragment>
    )
  }

  const renderExtra = useCallback(() => {
    const actionMap = {
      逾期未还清: [
        {
          name: '还款',
          props: {
            auth: '贷后监管-贷后管理-详情页-还款-国投',
            onClick: openPayBackForm,
            type: 'primary'
          }
        },
        {
          name: '上传保后报告',
          props: { auth: '贷后监管-贷后管理-详情页-上传贷后报告-国投', onClick: openPostLoanForm }
        }
      ],
      待还款: [
        {
          name: '还款',
          props: {
            auth: '贷后监管-贷后管理-详情页-还款-国投',
            onClick: openPayBackForm,
            type: 'primary'
          }
        },
        {
          name: '逾期',
          props: {
            auth: '贷后监管-贷后管理-详情页-逾期-国投',
            onClick: openOutDateForm
          }
        },
        {
          name: '上传保后报告',
          props: {
            auth: '贷后监管-贷后管理-详情页-上传贷后报告-国投',
            onClick: openPostLoanForm
          }
        }
      ],
      逾期已还清: []
    }

    return (
      <ButtonGroup align="right">
        {actionMap[info.bizStatus]?.map((b) => (
          <Button key={b.name} {...b.props}>
            {b.name}
          </Button>
        ))}
      </ButtonGroup>
    )
  }, [info.bizStatus, openOutDateForm, openPayBackForm, openPostLoanForm])

  // 时间轴
  const renderTimeline = () => {
    const items = warningInfo?.warningList
    return warningInfo?.warningList?.length > 0 ? (
      <div>
        <div className={isFold ? styles.foldWrap : styles.timelineWrap}>
          <Timeline>
            {items?.map((item) => {
              return (
                <Timeline.Item color={warning[item.level]?.color}>
                  <Tag color={warning[item.level]?.color}>预警等级{item.level}</Tag>
                  {item.warning_type}已达{item.warning_value}条
                  <span className={styles.date}> {item.warning_time}</span>
                </Timeline.Item>
              )
            })}
          </Timeline>
        </div>
        {warningInfo.warningList?.length > 2 && (
          <div className={styles.fold} onClick={() => handleFold()}>
            {isFold ? (
              <div style={{ cursor: 'pointer', margin: 'auto' }}>
                展开
                <Icon type="down" style={{ color: '#1989AA' }} />
              </div>
            ) : (
              <div style={{ cursor: 'pointer', margin: 'auto' }}>
                收起
                <Icon type="up" style={{ color: '#1989AA' }} />
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      <div className={styles.timelineWrap}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }
  const titleExtra = (
    <Link to={`/report/monitor/${id}`} target="_blank">
      查看报告{' '}
      <Icon type="double-right" style={{ fontSize: '10px', marginLeft: 2 }} theme="outlined" />
    </Link>
  )

  // 拓扑图label换行
  const formatLabel = (node) => {
    let label = node.orgAlias
    let text = node.orgAlias
    if (text?.length <= 4) {
      label = node.orgAlias
    } else if (text.length > 4 && text.length <= 9) {
      label = `${text.slice(0, 4)}\n${text.slice(4)}`
    } else {
      label = `${text.slice(0, 4)}\n${text.slice(4, 9)}\n${text.slice(9)}`
    }
    return label
  }

  // 绘制拓扑图
  useEffect(() => {
    if (
      Object.keys(data).length > 0 &&
      (data.dataSource === 0
        ? data.supplierSelf || data.clientSelf
        : data.supplierOther || data.clientOther)
    ) {
      // const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
      //   return [
      //     ['M', x, y],
      //     ['a', r, r, 0, 1, 0, r * 2, 0],
      //     ['a', r, r, 0, 1, 0, -r * 2, 0],
      //     ['M', x + 2, y],
      //     ['L', x + 2 * r - 2, y]
      //   ]
      // }
      // const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
      //   return [
      //     ['M', x, y],
      //     ['a', r, r, 0, 1, 0, r * 2, 0],
      //     ['a', r, r, 0, 1, 0, -r * 2, 0],
      //     ['M', x + 2, y],
      //     ['L', x + 2 * r - 2, y],
      //     ['M', x + r, y - r + 2],
      //     ['L', x + r, y + r - 2]
      //   ]
      // }

      // G6.registerNode(
      //   'tree-node',
      //   {
      //     drawShape: function drawShape(cfg, group) {
      //       const rect = group.addShape('rect', {
      //         attrs: {
      //           fill: '#fff',
      //           stroke: '#666',
      //         },
      //         name: 'rect-shape',
      //       });
      //       const content = cfg.name.replace(/(.{19})/g, '$1\n');
      //       const text = group.addShape('text', {
      //         attrs: {
      //           text: content,
      //           x: 0,
      //           y: 0,
      //           textAlign: 'left',
      //           textBaseline: 'middle',
      //           fill: '#666',
      //         },
      //         name: 'rect-shape',
      //       });
      //       const bbox = text.getBBox();
      //       const hasChildren = cfg.children && cfg.children.length > 0;
      //       if (hasChildren) {
      //         group.addShape('marker', {
      //           attrs: {
      //             x: bbox.maxX + 6,
      //             y: bbox.minX + bbox.height / 2 - 6,
      //             r: 6,
      //             symbol: COLLAPSE_ICON,
      //             stroke: '#666',
      //             lineWidth: 2,
      //           },
      //           name: 'collapse-icon',
      //         });
      //       }
      //       rect.attr({
      //         x: bbox.minX - 4,
      //         y: bbox.minY - 6,
      //         width: bbox.width + (hasChildren ? 26 : 8),
      //         height: bbox.height + 12,
      //       });
      //       return rect;
      //     },
      //   },
      //   'single-node',
      // );

      const width = document.getElementById('container').scrollWidth
      const height = document.getElementById('container').scrollHeight || 400
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        minZoom: 0.6,
        maxZoom: 3,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              trigger: 'dblclick',
              onChange: function onChange(item, collapsed) {
                const data = item.get('model').data
                data.collapsed = collapsed
                return true
              }
            },
            {
              type: 'tooltip',
              formatText(model) {
                return model.orgName
              },
              offset: 50
            },
            {
              type: 'edge-tooltip',
              formatText(model) {
                if (model.target.defaultCfg.model.type === 1) {
                  return (
                    '供应商：' +
                    model.target.defaultCfg.model.orgName +
                    '<br/>近一年交易金额： ' +
                    (model.target.defaultCfg.model.lastTotalTrade
                      ? formatMoney(model.target.defaultCfg.model.lastTotalTrade) + '元'
                      : '0.00元')
                  )
                } else {
                  return (
                    '客户：' +
                    model.target.defaultCfg.model.orgName +
                    '<br/>近一年交易金额： ' +
                    (model.target.defaultCfg.model.lastTotalTrade
                      ? formatMoney(model.target.defaultCfg.model.lastTotalTrade) + '元'
                      : '0.00元')
                  )
                }
              },
              offset: 10
            },
            // {
            //   type: 'zoom-canvas',
            //   sensitivity: '1'
            // },
            'drag-canvas',
            'drag-node'
            // 'zoom-canvas'
          ]
        },
        // container: 'container',
        // width,
        // height,
        // modes: {
        //   default: [
        //     {
        //       type: 'collapse-expand',
        //       onChange: function onChange(item, collapsed) {
        //         const data = item.get('model').data;
        //         const icon = item.get('group').find(element => element.get('name') === 'collapse-icon');
        //         if (collapsed) {
        //           icon.attr('symbol', EXPAND_ICON);
        //         } else {
        //           icon.attr('symbol', COLLAPSE_ICON);
        //         }
        //         data.collapsed = collapsed;
        //         return true;
        //       },
        //     },
        //     'drag-canvas',
        //     'zoom-canvas',
        //   ],
        // },
        // defaultNode: {
        //   type: 'tree-node',
        //   anchorPoints: [
        //     [0, 0.5],
        //     [1, 0.5],
        //   ],
        // },
        defaultNode: {
          // shape: 'rect',
          size: 60,
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10
            }
          },
          anchorPoints: [
            [0, 0.5],
            [1, 0.5]
          ],
          style: {
            fill: 'rgba(250, 251, 252, 1)',
            stroke: 'rgba(221, 221, 221, 1)'
            // width: 150
          }
        },

        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: 'rgba(164, 178, 192, 1)'
          }
        },

        layout: {
          type: 'mindmap',
          direction: 'H',
          // getId: function getId(d) {
          //   return d.id
          // },
          getHeight: function getHeight() {
            return 16
          },
          getWidth: function getWidth() {
            return 16
          },
          getVGap: function getVGap() {
            return 30
          },
          getHGap: function getHGap() {
            return 100
          },
          getSide: (d) => {
            if (d.data.type === 1) {
              return 'left'
            }
            return 'right'
          }
        }
      })

      graph.node(function(node) {
        let style = ''
        let labelCfg = ''
        if (node.type === 2) {
          style = {
            fill: 'rgba(92, 218, 211, 0.1)',
            stroke: 'rgba(92, 218, 211, 1)',
            width: 150
          }
          labelCfg = {
            style: {
              // fill: 'rgba(25, 137, 170, 1)',
              fontSize: 10
            }
          }
        } else if (node.orgId) {
          style = {
            fill: 'rgba(105, 192, 255, 0.15)',
            stroke: 'rgba(105, 192, 255, 1)'
            // width: 150
          }
          labelCfg = {
            style: {
              // fill: 'rgba(0, 0, 0, 0.65)',
              fontSize: 10
            }
          }
        } else {
          style = {
            fill: 'rgba(255, 192, 105, 0.15)',
            stroke: 'rgba(255, 192, 105, 1)'
            // width: 150
          }
          labelCfg = {
            style: {
              // fill: 'rgba(0, 0, 0, 0.65)',
              fontSize: 10
            }
          }
        }

        return {
          label: formatLabel(node),
          style: style,
          labelCfg: labelCfg
        }
      })

      graph.edge(function(node) {
        if (node?.target?.defaultCfg?.model?.type === 1) {
          return {
            type: 'cubic-horizontal',
            color: 'rgba(151, 151, 151, 1)',
            label: node?.target?.defaultCfg?.model?.lastTotalTrade
              ? formatMoney(node?.target?.defaultCfg?.model?.lastTotalTrade) + '元'
              : '0.00元',
            style: {
              // stroke: '#A3B1BF',
              startArrow: {
                path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
                fill: 'rgba(164, 178, 192, 1)'
              }
            }
          }
        } else {
          return {
            type: 'cubic-horizontal',
            color: 'rgba(151, 151, 151, 1)',
            label: node?.target?.defaultCfg?.model?.lastTotalTrade
              ? formatMoney(node?.target?.defaultCfg?.model?.lastTotalTrade) + '元'
              : '0.00元',
            style: {
              // stroke: '#A3B1BF',
              endArrow: {
                path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
                fill: 'rgba(164, 178, 192, 1)'
              }
            }
          }
        }
      })

      graph.on('canvas:click', function(e) {
        // 将单个 Behavior 添加到单个模式（默认的 default 模式）中

        graph.addBehaviors(
          {
            type: 'zoom-canvas',
            sensitivity: '1'
          },
          'default'
        )
      })

      graph.on('node:click', function(e) {
        const item = e.item

        if (item.defaultCfg.model.orgId) {
          // 如果是本企业，则不跳转
          if (item.defaultCfg.model.type === 2) {
          } else windowOpen(`/msEnterprise/company/view/${item.defaultCfg.model.orgId}`)
          // window.open(`/msEnterprise/company/view/${item.defaultCfg.model.orgId}`, '_blank')
          // router.push(`/msEnterprise/company/view/${item.defaultCfg.model.orgId}`)
        } else {
          windowOpen(`https://www.tianyancha.com/search?key=${item.defaultCfg.model.orgName}`)
          // window.open(
          //   `https://www.tianyancha.com/search?key=${item.defaultCfg.model.orgName}`,
          //   '_blank'
          // )
        }
      })

      graph.data(data.topology)
      graph.render()
      graph.fitView()
      // }
    }
  }, [data])

  // 发散图
  // useEffect(() => {
  //   if (Object.keys(data).length > 0 && (data?.supplier || data?.dealer)) {
  //     const width = document.getElementById('test').scrollWidth
  //     const height = document.getElementById('test').scrollHeight || 500
  //     const graph = new G6.Graph({
  //       container: 'test',
  //       width,
  //       height,
  //       layout: {
  //         type: 'force',
  //         // center: [ 200, 200 ],
  //         // edgeStrength: 0.7,
  //         linkDistance: 200,
  //         preventOverlap: true,
  //         collideStrength: 1, //防止重叠的力度
  //         gravity: 5, // 可选
  //         nodeStrength: -100,

  //         workerEnabled: true
  //       },
  //       modes: {
  //         default: [
  //           'drag-canvas',
  //           'zoom-canvas',
  //           {
  //             type: 'tooltip',
  //             formatText: function formatText(model) {
  //               return model.orgName
  //             },
  //             offset: 30
  //           },
  //           {
  //             type: 'edge-tooltip',
  //             formatText: function formatText(model, e) {
  //               const edge = e.item
  //               return (
  //                 '供应商：' +
  //                 edge.getSource().getModel().orgName +
  //                 '<br/>经销商：' +
  //                 edge.getTarget().getModel().orgName +
  //                 '<br/>上年累计交易： ' +
  //                 (model.lastTotalTrade ? model.lastTotalTrade + '元' : '无')
  //               )
  //             },
  //             offset: 30
  //           }
  //         ]
  //       },

  //       defaultNode: {
  //         size: [70, 70],
  //         style: {
  //           lineWidth: 2,
  //           fill: 'rgba(255, 255, 255, 1)',
  //           stroke: 'rgba(221, 221, 221, 1)'
  //         }
  //       },

  //       defaultEdge: {
  //         size: 1,
  //         style: {
  //           stroke: 'rgba(0, 0, 0, 0.25)',
  //           lineAppendWidth: 2,
  //           endArrow: {
  //             path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
  //             fill: 'rgba(0, 0, 0, 0.35)'
  //           }
  //         }
  //       },

  //       nodeStateStyles: {
  //         highlight: {
  //           opacity: 1
  //         },
  //         dark: {
  //           opacity: 0.35
  //         }
  //       },
  //       edgeStateStyles: {
  //         highlight: {
  //           // stroke: 'rgba(25, 137, 170, 1)',
  //           opacity: 1
  //         },
  //         dark: {
  //           opacity: 0.35
  //         }
  //       }
  //     })

  //     function clearAllStats() {
  //       graph.setAutoPaint(false)
  //       graph.getNodes().forEach(function(node) {
  //         graph.clearItemStates(node)
  //         graph.updateItem(node, {
  //           label: node.defalutLabel,
  //           labelCfg: {
  //             style: {
  //               fillOpacity: 1
  //               // fill: 'rgba(0, 0, 0, 0.65)',
  //             }
  //           }
  //         })
  //       })
  //       graph.getEdges().forEach(function(edge) {
  //         graph.clearItemStates(edge)
  //         graph.updateItem(edge, {
  //           label: edge.defalutLabel,
  //           labelCfg: {
  //             style: {
  //               fillOpacity: 1
  //               // fill: 'rgba(0, 0, 0, 0.65)',
  //             }
  //           }
  //         })
  //       })
  //       graph.paint()
  //       graph.setAutoPaint(true)
  //     }

  //     graph.on('node:click', function(e) {
  //       const item = e.item
  //       graph.setAutoPaint(false)
  //       graph.getNodes().forEach(function(node) {
  //         graph.clearItemStates(node)
  //         graph.setItemState(node, 'dark', true)
  //         graph.updateItem(node, {
  //           label: node.defalutLabel,
  //           labelCfg: {
  //             style: {
  //               fillOpacity: 0.35
  //               // fill: 'rgba(0, 0, 0, 0.15)',
  //             }
  //           }
  //         })
  //       })
  //       graph.setItemState(item, 'dark', false)
  //       graph.setItemState(item, 'highlight', true)
  //       graph.updateItem(item, {
  //         label: item.defalutLabel,
  //         labelCfg: {
  //           style: {
  //             fillOpacity: 1
  //             // fill: 'rgba(25, 137, 170, 1)',
  //           }
  //         }
  //       })
  //       graph.getEdges().forEach(function(edge) {
  //         if (edge.getSource() === item) {
  //           graph.setItemState(edge.getTarget(), 'dark', false)
  //           graph.setItemState(edge.getTarget(), 'highlight', true)
  //           graph.updateItem(edge.getTarget(), {
  //             label: edge.getTarget().defalutLabel,
  //             labelCfg: {
  //               style: {
  //                 fillOpacity: 1
  //                 // fill: 'rgba(0, 0, 0, 0.65)',
  //               }
  //             }
  //           })
  //           graph.setItemState(edge, 'highlight', true)
  //           graph.updateItem(edge, {
  //             label: edge.defalutLabel,
  //             labelCfg: {
  //               style: {
  //                 fillOpacity: 1
  //                 // fill: 'rgba(0, 0, 0, 0.15)',
  //               }
  //             }
  //           })
  //           edge.toFront()
  //         } else if (edge.getTarget() === item) {
  //           graph.setItemState(edge.getSource(), 'dark', false)
  //           graph.setItemState(edge.getSource(), 'highlight', true)
  //           graph.updateItem(edge.getSource(), {
  //             label: edge.getSource().defalutLabel,
  //             labelCfg: {
  //               style: {
  //                 fillOpacity: 1
  //                 // fill: 'rgba(0, 0, 0, 0.65)',
  //               }
  //             }
  //           })
  //           graph.setItemState(edge, 'highlight', true)
  //           graph.updateItem(edge, {
  //             label: edge.defalutLabel,
  //             labelCfg: {
  //               style: {
  //                 fillOpacity: 1
  //                 // fill: 'rgba(0, 0, 0, 0.15)',
  //               }
  //             }
  //           })
  //           edge.toFront()
  //         } else {
  //           graph.setItemState(edge, 'highlight', false)
  //           graph.setItemState(edge, 'dark', true)
  //           graph.updateItem(edge, {
  //             label: edge.defalutLabel,
  //             labelCfg: {
  //               style: {
  //                 fillOpacity: 0.35
  //                 // fill: 'rgba(0, 0, 0, 0.15)',
  //               }
  //             }
  //           })
  //         }
  //       })
  //       graph.paint()
  //       graph.setAutoPaint(true)
  //     })
  //     // graph.on('node:mouseleave', clearAllStats);
  //     graph.on('canvas:click', clearAllStats)
  //     graph.edge(function(edge) {
  //       return {
  //         label: edge?.lastTotalTrade ? edge.lastTotalTrade + '元' : '无',
  //         labelCfg: {
  //           style: {
  //             fill: 'rgba(0, 0, 0, 0.65)'
  //           }
  //         }
  //       }
  //     })
  //     graph.node(function(node) {
  //       return {
  //         // style: style,
  //         label: formatLabel(node)
  //         // labelCfg: {
  //         //   style: {
  //         //     fill: 'rgba(0, 0, 0, 0.65)'
  //         //   }
  //         // }
  //       }
  //     })

  //     if (Object.keys(data?.topology).length > 0) {
  //       graph.data({
  //         nodes: data?.topology.nodes,
  //         edges: data?.topology?.edges?.map(function(edge, i) {
  //           edge.id = 'edge' + i
  //           return Object.assign({}, edge)
  //         })
  //       })

  //       graph.render()
  //     }
  //   }
  // }, [data])

  return (
    <Card loading={fetching} transparent>
      {renderForm()}
      <Card>
        <Card.Header
          color={financeStatus[info.bizStatus]?.color}
          name={financeStatus[info.bizStatus]?.name}
          extra={renderExtra()}
        >
          <IconFont
            className={styles.icon}
            // style={{ color: '#1989AA', top: 2, marginRight: 8, fontSize: 24 }}
            type="iconyindan"
          />
          担保编号 {info.bizNo}
        </Card.Header>
        <DescriptionList column={6} layout="vertical">
          <Description label="申请企业">{info.extra?.orgName}</Description>
          <Description label="企业类型">{info.extra?.orgType}</Description>
          <Description label="申请担保金额(元)">
            {formatMoney(info.extra?.applyFinanceAmount)}
          </Description>
          <Description label="放款金额(元)">{formatMoney(info.extra?.loanPayAmount)}</Description>
          <Description label="放款银行">{info.extra?.loanPayBankName}</Description>
          <Description label="约定还款日">{info.extra?.loanAppointDate}</Description>
        </DescriptionList>
      </Card>
      {/* <div className={styles.container}>
        <div className={styles.wrap} style={{ flexGrow: 3 }}>
          <RiskCardList>
            <RiskCardList.RiskCard bizNo={id} reportType="info" style={{ flexGrow: 1 }} />
            <RiskCardList.RiskCard
              bizNo={id}
              reportType="FRAUD_REPORT"
              fetchPerfection={fetchPerfectionReq}
              hideAction
              style={{ flexGrow: 1 }}
            />
            <RiskCardList.RiskCard
              bizNo={id}
              reportType="RISK_REPORT"
              fetchPerfection={fetchPerfectionReq}
              hideAction
              style={{ flexGrow: 1 }}
            />
          </RiskCardList>
        </div>
        <div className={styles.wrap} style={{ marginLeft: -10, flexGrow: 1 }}>
          <RiskCardList>
            <RiskCardList.RiskCard bizNo={id} reportType="total" data={perfection} />
          </RiskCardList>
        </div>
      </div> */}
      <Card>
        {/* <RiskMarkList> */}
        <RiskMarkList.RiskMark bizNo={id} reportType="RISK_REPORT" hideAction />
        {/* </RiskMarkList> */}
      </Card>
      <Card title="风险预警" titleExtra={titleExtra}>
        {renderTimeline()}
      </Card>
      <Card title="担保流程">
        <TimelineBiz bizNo={id} />
      </Card>
      <Card title="供销关系">
        <SupplyRelationInfo
          data={data}
          topology={
            (data.dataSource === 0
              ? data.supplierSelf || data.clientSelf
              : data.supplierOther || data.clientOther) && (
              <Card
                style={{ backgroundColor: 'rgba(250, 251, 252, 1)', marginLeft: 0, marginRight: 0 }}
              >
                {/* <div id="test"></div> */}
                <div id="container"></div>
              </Card>
            )
          }
          extra={
            (data.dataSource === 0
              ? data.supplierSelf || data.clientSelf
              : data.supplierOther || data.clientOther) && (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0 0 0' }}
              >
                <div>注：金额为近一年交易金额</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  供应商
                  <IconFont type="icontop4" />
                  客户
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: 'rgba(92, 218, 211, 1)',
                      marginLeft: 16,
                      marginRight: 5
                    }}
                  ></div>
                  本企业
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: 'rgba(105, 192, 255, 1)',
                      marginLeft: 16,
                      marginRight: 5
                    }}
                  ></div>
                  本平台企业
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: 'rgba(255, 192, 105, 1)',
                      marginLeft: 16,
                      marginRight: 5
                    }}
                  ></div>
                  未入驻企业
                </div>
              </div>
            )
          }
        />
      </Card>
      <Card tabList={getTabList(showFirstTab)} activeTabKey={activeKey} onTabChange={setActiveKey}>
        {tab[activeKey]()}
      </Card>
    </Card>
  )
}

export default Detail
