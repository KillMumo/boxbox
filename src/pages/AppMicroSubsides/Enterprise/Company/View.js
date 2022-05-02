import React, { useEffect } from 'react'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { Button } from 'antd'
import { useRequest } from '@dragon/hooks'
import { fetchDetail, fetchCompanyTimeline } from '@/services/microSubsidy/enterprise'
import { CompanyBasicInfo, BankInfo, FamilyInfo, AdminInfo } from '../../components/Detail'
import Timeline, { useTimeline } from '@/components/Timeline'
import G6 from '@antv/g6'
import { fetchSupplyDealerTopology } from '@/services/microSubsidy/enterprise'
import SupplyRelationInfo from '../../components/SupplyRelationInfo'
import IconFont from '@/components/IconFont'
import { windowOpen, formatMoney } from '@/utils'

const View = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props

  // 获取企业供销关系图
  const { data: graphData = {}, start: fetchSupplyDealerTopologyReq } = useRequest(
    fetchSupplyDealerTopology,
    {
      manual: true
    }
  )

  const { loading, data = {} } = useRequest(() => fetchDetail(id), {
    onSuccess: (res) => {
      fetchSupplyDealerTopologyReq({ orgName: res.companyBasicInfoVO.orgName })
    }
  })

  const { props: timelineProps } = useTimeline(() => fetchCompanyTimeline(id), {
    showExtra: false
  })

  const renderExtra = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div style={{ marginRight: 60 }}>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', fontWeight: 400 }}>信息完善分</div>
          <div style={{ fontSize: 24, color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>
            {data.infoPerfection}
          </div>
        </div>
        <div
          style={{
            width: 1,
            height: 60,
            backgroundColor: 'rgba(238, 238, 238, 1)',
            marginRight: 60
          }}
        />
        <ButtonGroup>
          <Button
            auth="企业管理-企业管理-详情页-编辑"
            to={`/msEnterprise/company/edit/${id}`}
            type="primary"
          >
            编辑
          </Button>
          <Button
            auth="企业管理-企业管理-详情页-申请融资担保"
            to={`/msFinance/apply?orgName=${data.companyBasicInfoVO?.orgName}`}
          >
            申请融资担保
          </Button>
        </ButtonGroup>
      </div>
    )
  }

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
      Object.keys(graphData).length > 0 &&
      (data.dataSource === 0
        ? data.supplierSelf || data.clientSelf
        : data.supplierOther || data.clientOther)
    ) {
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

      // graph.on('wheelzoom', function(e) {
      //   graph.on('canvas:mouseleave', function(e) {
      //     // 从单个模式中移除单个 Behavior
      //     graph.removeBehaviors('zoom-canvas', 'default')
      //   })
      // })

      // graph.on('canvas:click', function(e) {
      //   // 从单个模式中移除单个 Behavior
      //   graph.removeBehaviors('zoom-canvas', 'default')
      // })

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

      graph.data(graphData)
      graph.render()
      graph.fitView()
      // }
    }
  }, [data, graphData])

  return (
    <Card loading={loading} transparent>
      <Card>
        <Card.Header extra={renderExtra()}>{data.companyBasicInfoVO?.orgName}</Card.Header>
        入驻时间：{data.createTime}
      </Card>
      <Card title="更新记录">
        <Timeline {...timelineProps} />
      </Card>
      <Card title="企业信息">
        <CompanyBasicInfo
          data={{
            uid: data.uid,
            ...data.companyBasicInfoVO,
            ...data.legalPersonVO,
            ...data.realControlPerson
          }}
        />
      </Card>
      <Card title="银行账户信息">
        <BankInfo dataSource={[data.baseAccount, ...(data.generalAccount || [])]} />
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
      <Card title="关联人信息">
        <FamilyInfo
          parent={data.parent || []}
          mate={data.mate || []}
          child={data.children || []}
          orgName={data.companyBasicInfoVO?.orgName}
        />
      </Card>
      <Card title="管理员信息">
        <AdminInfo data={data.admin} />
      </Card>
    </Card>
  )
}

export default View
