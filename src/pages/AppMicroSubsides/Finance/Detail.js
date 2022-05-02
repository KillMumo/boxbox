import React, { useState, useEffect } from 'react'
import Card from '@/components/Card'
import DescriptionList from '@/components/DescriptionList'
import Timeline from '@/components/Timeline/TimelineBiz'
import RejectInfo from '@/components/RejectInfo'
import FinanceInfo from '../components/FinanceInfo'
// import CompanyInfo from '../components/CompanyInfo'
import Iconfont from '@/components/IconFont'
import ButtonGroup from '@/components/ButtonGroup'
import PassAndRejectForm from '../components/ModalForms/PassAndRejectForm'
import BizPassForm from '../components/ModalForms/BizPassForm'
import PayForm from '../components/ModalForms/PayForm'
import { Button, Modal, message, Popover, Icon } from 'antd'
import { useRequest } from '@dragon/hooks'
import {
  fetchDetail,
  agree,
  reject,
  startFinance,
  calculate,
  getCompanyDetail,
  fetchBusiness
} from '@/services/microSubsidy/finance'
// import {
//   fetchDetail as fetchCmyDetail,
//   fetchSupplyDealerTopology
// } from '@/services/microSubsidy/enterprise'
import useModalForm from '@/hooks/useModalForm'
import router from 'umi/router'
import { financeStatus } from '../common/dict'
import { formatMoney } from '@/utils'
import CalculateForm from '../components/ModalForms/CalculateForm'
import RiskMarkList from '../components/RiskMarkList'
import G6 from '@antv/g6'
// import { fetchReport } from '@/services/microSubsidy/enterprise'
// import SupplyRelationList from '../components/SupplyRelationList'
// import styles from './styles.less'
import BusinessInfo from '../components/BusinessInfo'
import SupplyRelationInfo from '../components/SupplyRelationInfo'
import IconFont from '@/components/IconFont'
import { windowOpen } from '@/utils'
import { useSelector } from 'react-redux'
import Suspense from '@/components/Suspense'
import styles from './styles.less'

// const { TabPane } = Tabs

// const tabList = [
//   { key: '1', tab: '企业信息' },
//   { key: '2', tab: '融资信息' },
//   { key: '3', tab: '评估信息' }
// ]

const CompanyInfo = React.lazy(() => import('../components/CompanyInfo'))

const getTabList = (show) =>
  [
    { key: '1', tab: '担保信息' },
    show && { key: '2', tab: '评估信息' },
    { key: '3', tab: '企业信息' }
  ].filter((i) => i)

const Detail = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  // 监听localStorage
  //   window.addEventListener('storage', function (e) {
  //     if (e.key === 'ctc-msg') {
  //         const data = JSON.parse(e.newValue);
  //         // const text = '[receive] ' + data.msg + ' —— tab ' + data.from;
  //         console.log(data);

  //         console.log('receive message:');
  //     }
  // });

  // 企业信息和融资信息tab的key
  const [activeKey, setActiveKey] = useState('1')

  // 业务员通过按钮
  const [ywyDisabled, toggleYwyDisabled] = useState(true)
  // const [fkDisabled, toggleFkDisabled] = useState(true)
  const [showTab, setShowTab] = useState(false)

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
  //       // console.log('safsafas')
  //     }
  //   }
  // )

  // 获取企业详情
  const { loading: fetchingCmyDetail, data = {}, start: fetchCmyDetailReq } = useRequest(
    getCompanyDetail,
    {
      manual: true,
      onSuccess: (res) => {
        // console.log("dddd",res.companyBasicInfoVO.orgName);
        // fetchSupplyDealerTopologyReq({ orgName: res.companyBasicInfoVO.orgName })
      }
    }
  )

  // 获取业务评估数据
  const { data: businessData = {}, start: fetchBusinessReq } = useRequest(fetchBusiness, {
    manual: true,
    onSuccess: (res) => {
      if (res.isBizEstimated === true) {
        setShowTab(true)
      }
    }
  })

  // 获取融资详情
  const { data: info = {}, loading: fetching } = useRequest(() => fetchDetail({ bizNo: id }), {
    onSuccess: (res) => {
      fetchCmyDetailReq({ bizNo: id })
      fetchBusinessReq({ bizNo: id })
    }
  })

  // 通过业务员审批通过
  const { loading: bizAgreeLoading, start: bizAgreeReq } = useRequest(agree, { manual: true })
  const { open: openBizPassForm, props: bizPassFormProps } = useModalForm({
    title: '审批通过',
    confirmLoading: bizAgreeLoading,
    afterValidate: async (v, close) => {
      const res = await bizAgreeReq({
        taskName: info.currentTask,
        processId: info.processId,
        ...v
      })
      if (res instanceof Error) return
      message.success('审批成功')
      window.location.reload()
    }
  })

  // 财务计算
  const { loading: calculateLoading, start: calculateReq } = useRequest(calculate, { manual: true })
  const { props: calculateFormProps } = useModalForm({
    title: '财务计算',
    confirmLoading: calculateLoading,
    afterValidate: async (v, close) => {
      const res = await calculateReq({
        taskName: info.currentTask,
        processId: info.processId,
        bizNo: info.bizNo,
        ...v
      })
      if (res instanceof Error) return
      close()
      window.location.reload()
    }
  })

  const handleBussiness = () => {
    windowOpen(`/msFinance/business/${id}`)
    // window.open(`/msFinance/business/${id}`)
    // //监听业务评估打开的新页面返回的消息
    // window.addEventListener('message', function(e) {
    //   // console.log('[Cross-document Messaging] receive message:')
    //   window.location.reload()
    // })
    //监听业务评估打开的新页面返回的消息
    window.addEventListener('storage', function(e) {
      if (e.key === 'ctc-msg') {
        window.location.reload()
      }
    })
  }

  // 通过弹出框表单
  const { loading: agreeLoading, start: agreeReq } = useRequest(agree, { manual: true })
  const { open: openPassForm, props: passFormProps } = useModalForm({
    title: '审批通过',
    confirmLoading: agreeLoading,
    afterValidate: async (v, close) => {
      const res = await agreeReq({
        taskName: info.currentTask,
        processId: info.processId,
        ...v
      })
      if (res instanceof Error) return
      message.success('审批成功')
      window.location.reload()
    }
  })

  // 驳回弹出框表单
  const { loading: rejectLoading, start: rejectReq } = useRequest(reject, { manual: true })
  const { open: openRejectForm, props: rejectFormProps } = useModalForm({
    title: '审批退回',
    confirmLoading: rejectLoading,
    afterValidate: async (v, close) => {
      const res = await rejectReq({
        taskName: info.currentTask,
        processId: info.processId,
        ...v
      })
      if (res instanceof Error) return
      message.success('审批成功')
      window.location.reload()
    }
  })

  // 放款弹出框表单
  const { loading: payLoading, start: payReq } = useRequest(agree, { manual: true })
  const { open: openPayForm, props: payFormProps } = useModalForm({
    info: info,
    title: '放款',
    confirmLoading: payLoading,
    afterValidate: async (v, close) => {
      const res = await payReq({
        taskName: info.currentTask,
        processId: info.processId,
        ...v
      })
      if (res instanceof Error) return
      message.success('放款成功')
      router.push('/msFinance/list/全部')
    }
  })

  // 企业信息和融资信息tab页
  const tab = {
    '1': () => <FinanceInfo data={info.extra || {}} />,
    '2': () => <BusinessInfo data={businessData.data} info={info.extra} />,
    '3': () => (
      <Suspense>
        <CompanyInfo hideAdmin hideSupply data={data} />
      </Suspense>
    )
  }

  const renderRejectInfo = () => {
    return null && <RejectInfo />
  }

  const codes = useSelector(({ authorities }) => authorities.button.buttons)

  const renderExtra = () => {
    // 修改
    const handleEdit = () => {
      router.push(`/msFinance/edit/${id}`)
    }

    // 重新提交
    const handleSubmit = () => {
      Modal.confirm({
        title: '确定要重新提交么',
        content: '一旦提交，将重新进入审批流程',
        onOk: () => {
          return startFinance(info.extra).then((res) => {
            if (res instanceof Error) return
            window.location.reload()
          })
        }
      })
    }

    const actionMap = {
      // 有财务计算
      待业务员提交: [
        {
          name: '修改',
          props: { auth: '融资管理-详情页-编辑-国投', onClick: handleEdit, type: 'primary' }
        },
        { name: '提交', props: { auth: '融资管理-详情页-提交-国投', onClick: handleSubmit } }
      ],
      待业务员审批: [
        {
          name: '通过',
          props: {
            disabled: ywyDisabled,
            auth: '融资管理-详情页-业务员审批-通过-国投',
            onClick: openBizPassForm,
            type: 'primary'
          }
        },
        {
          name: '编辑',
          props: {
            auth: '融资管理-详情页-编辑-国投',
            to: `/msFinance/editchecked/${id}`
          }
        },
        !showTab && {
          name: '业务评估',
          props: {
            auth: '融资管理-详情页-财务计算-国投',
            onClick: handleBussiness,
            id: 'business',
            type: 'primary'
          }
        },
        showTab && {
          name: '重新业务评估',
          props: {
            auth: '融资管理-详情页-财务计算-国投',
            onClick: handleBussiness,
            id: 'business'
          }
        },
        {
          name: '退回',
          props: { auth: '融资管理-详情页-业务员审批-退回-国投', onClick: openRejectForm }
        }
      ].filter((i) => i),
      待风控审批: [
        {
          name: '通过',
          props: {
            auth: '融资管理-详情页-风控审批-通过-国投',
            onClick: openPassForm,
            type: 'primary'
          }
        },
        {
          name: '退回',
          props: { auth: '融资管理-详情页-风控审批-退回-国投', onClick: openRejectForm }
        }
      ],
      待总经理审批: [
        {
          name: '通过',
          props: {
            auth: '融资管理-详情页-总经理审批-通过-国投',
            onClick: openPassForm,
            type: 'primary'
          }
        },
        {
          name: '退回',
          props: { auth: '融资管理-详情页-总经理审批-退回-国投', onClick: openRejectForm }
        }
      ],
      待委员会审批: [
        {
          name: '通过',
          props: {
            auth: '融资管理-详情页-风控委员会审批-通过-国投',
            onClick: openPassForm,
            type: 'primary'
          }
        },
        {
          name: '退回',
          props: { auth: '融资管理-详情页-风控委员会审批-退回-国投', onClick: openRejectForm }
        }
      ],
      待放款: [
        {
          name: '放款',
          props: { auth: '融资管理-详情页-放款-国投', onClick: openPayForm, type: 'primary' }
        }
      ]
    }

    const popoverMap = {
      待业务员审批: codes.includes('融资管理-详情页-业务员审批-通过-国投') && (
        <Popover
          content={<span>退回：融资担保材料不全或有误，退至上一步重新处理提交</span>}
          placement="top"
        >
          <Icon
            type="question-circle"
            style={{ color: 'rgba(217, 217, 217, 1)', fontSize: 14, marginRight: 10 }}
          />
        </Popover>
      ),
      待风控审批: codes.includes('融资管理-详情页-风控审批-通过-国投') && (
        <Popover
          content={<span>退回：融资担保材料不全或有误，退至上一步重新处理提交</span>}
          placement="top"
        >
          <Icon
            type="question-circle"
            style={{ color: 'rgba(217, 217, 217, 1)', fontSize: 14, marginRight: 10 }}
          />
        </Popover>
      ),
      待总经理审批: codes.includes('融资管理-详情页-总经理审批-通过-国投') && (
        <Popover
          content={<span>退回：融资担保材料不全或有误，退至上一步重新处理提交</span>}
          placement="top"
        >
          <Icon
            type="question-circle"
            style={{ color: 'rgba(217, 217, 217, 1)', fontSize: 14, marginRight: 10 }}
          />
        </Popover>
      ),
      待委员会审批: codes.includes('融资管理-详情页-风控委员会审批-通过-国投') && (
        <Popover
          content={<span>退回：融资担保材料不全或有误，退至上一步重新处理提交</span>}
          placement="top"
        >
          <Icon
            type="question-circle"
            style={{ color: 'rgba(217, 217, 217, 1)', fontSize: 14, marginRight: 10 }}
          />
        </Popover>
      )
    }

    return (
      <ButtonGroup>
        {popoverMap[info.bizStatus]}
        {actionMap[info.bizStatus]?.map((b) => (
          <Button key={b.name} {...b.props}>
            {b.name}
          </Button>
        ))}
      </ButtonGroup>
    )
  }

  const renderForms = () => {
    return (
      <React.Fragment>
        {/* 财务计算表单 */}
        <CalculateForm {...calculateFormProps} />
        {/* 业务员审批通过表单 */}
        <BizPassForm {...bizPassFormProps} />
        {/* 通过表单 */}
        <PassAndRejectForm {...passFormProps} />
        {/* 退回表单 */}
        <PassAndRejectForm {...rejectFormProps} />
        {/* 放款表单 */}
        <PayForm {...payFormProps} />
      </React.Fragment>
    )
  }

  const formatLabel = (node) => {
    let label = node.orgAlias
    let text = node.orgAlias
    if (text?.length <= 4) {
      label = node.orgAlias
    } else if (text?.length > 4 && text?.length <= 9) {
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
            // 如果节点type为1，为供销商，出现在左侧
            if (d.data.type === 1) {
              return 'left'
            }
            // 否则出现在右侧
            return 'right'
          }
        }
      })

      graph.node(function(node) {
        let style = ''
        let labelCfg = ''
        // 如果节点type为2，即本企业所在的根结点，设置样式
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
        // 如果节点type为1，即供销商，设置箭头在父节点出现
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
        }
        // 否则，为经销商，设置箭头在子节点出现
        else {
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

      // 节点点击事件
      graph.on('node:click', function(e) {
        const item = e.item
        // console.log('item',item);

        // 如果有orgId，则为平台企业，跳转到企业详情页
        if (item.defaultCfg.model.orgId) {
          // 如果是本企业，则不跳转
          if (item.defaultCfg.model.type === 2) {
          } else windowOpen(`/msEnterprise/company/view/${item.defaultCfg.model.orgId}`)
          // window.open(`/msEnterprise/company/view/${item.defaultCfg.model.orgId}`, '_blank')
          // router.push(`/msEnterprise/company/view/${item.defaultCfg.model.orgId}`)
        }
        // 否则，跳转到天眼查
        else {
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
  //       // console.log('item',item);

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
  //       item.defaultCfg.model.orgId && router.push(`/msEnterprise/company/edit/${item.defaultCfg.model.orgId}`)
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
    <Card loading={fetching || fetchingCmyDetail} transparent>
      {renderForms()}
      {renderRejectInfo()}
      <Card>
        <Card.Header
          color={financeStatus[info.bizStatus]?.color}
          name={financeStatus[info.bizStatus]?.name}
          extra={renderExtra()}
        >
          <Iconfont
            className={styles.icon}
            // style={{ color:'#1989AA', top: 2, marginRight: 8, fontSize: 24 }}
            type="iconyindan"
          />
          担保编号 {info.extra?.bizNo}
        </Card.Header>
        <DescriptionList layout="vertical" column={4}>
          <DescriptionList.Description label="申请企业">
            {data.companyBasicInfoVO?.orgName}
          </DescriptionList.Description>
          <DescriptionList.Description label="所属行业">
            {data.companyBasicInfoVO?.orgType}
          </DescriptionList.Description>
          <DescriptionList.Description label="申请担保金额(元)">
            {formatMoney(info.extra?.applyFinanceAmount)}
          </DescriptionList.Description>
          <DescriptionList.Description label="预计还款日">
            {info.extra?.paymentDate}
          </DescriptionList.Description>
        </DescriptionList>
      </Card>
      {/* <div className={styles.container}>
        <div className={styles.wrap} style={{ flexGrow: 3 }}>
          <RiskCardList>
            <RiskCardList.RiskCard bizNo={id} reportType="info" style={{ flexGrow: 1 }} />
            <RiskCardList.RiskCard
              toggle={toggleYwyDisabled}
              bizNo={id}
              reportType="FRAUD_REPORT"
              fetchPerfection={fetchPerfectionReq}
              style={{ flexGrow: 1 }}
            />
            <RiskCardList.RiskCard
              toggle={toggleFkDisabled}
              bizNo={id}
              reportType="RISK_REPORT"
              fetchPerfection={fetchPerfectionReq}
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
      {showTab && (
        <Card>
          {/* <RiskMarkList> */}
          <RiskMarkList.RiskMark toggle={toggleYwyDisabled} bizNo={id} reportType="RISK_REPORT" />
          {/* </RiskMarkList> */}
        </Card>
      )}
      <Card title="担保流程">
        <Timeline bizNo={id} />
      </Card>
      <Card title="供销关系">
        <SupplyRelationInfo
          data={data}
          orgName={data.companyBasicInfoVO?.orgName}
          topology={
            (data.dataSource === 0
              ? data.supplierSelf || data.clientSelf
              : data.supplierOther || data.clientOther) && (
              <Card
                style={{ backgroundColor: 'rgba(250, 251, 252, 1)', marginLeft: 0, marginRight: 0 }}
              >
                <div id="container"></div>
                {/* <div id="test" /> */}
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
      {/* <Card title="供销关系">
        <Tabs type="card" style={{ marginTop: -18 }}>
          <TabPane tab="供销商" key="1">
            <Card style={{ marginTop: -18, marginLeft: 0, marginRight: 0 }}>
              <SupplyRelationList data={data.supplier} type="供销商" />
            </Card>
          </TabPane>
          <TabPane tab="客户" key="2">
            <Card style={{ marginTop: -18, marginLeft: 0, marginRight: 0 }}>
              <SupplyRelationList data={data.dealer} type="客户" />
            </Card>
          </TabPane>
        </Tabs>
      </Card> */}
      <Card tabList={getTabList(showTab)} onTabChange={setActiveKey}>
        {tab[activeKey]()}
      </Card>
    </Card>
  )
}

export default Detail
