import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Card from '@/components/Card'
import G6 from '@antv/g6'
import styles from './styles.less'
import './registerShape'
import { fetchTraceData } from '@/services/carbon/mine'
import { useRequest } from '@dragon/hooks'
import router from 'umi/router'
// import { data } from './data.js'

const Page = () => {
  const ref = useRef(null)
  const container = ReactDOM.findDOMNode(ref.current)

  const { loading } = useRequest(() => fetchTraceData(), {
    onSuccess: (data) => {
      const graph = new G6.TreeGraph({
        container: container,
        width: ref.current.clientWidth,
        height: ref.current.clientHeight || 500,
        modes: {
          default: ['zoom-canvas', 'drag-canvas']
        },
        fitView: true,
        animate: true,
        defaultNode: {
          type: 'flow-rect'
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#CED4D9'
          }
        },
        layout: {
          type: 'indented',
          direction: 'LR',
          dropCap: false,
          indent: 300,
          getHeight: () => {
            return 60
          }
        },
        padding: [20, 50],
        defaultLevel: 3,
        defaultZoom: 0.8
      })

      graph.data(data)
      graph.render()
      graph.zoom(0.8)

      const handleCollapse = (e) => {
        const target = e.target
        const id = target.get('modelId')
        const item = graph.findById(id)
        const nodeModel = item.getModel()
        nodeModel.collapsed = !nodeModel.collapsed
        graph.layout()
        graph.setItemState(item, 'collapse', nodeModel.collapsed)
      }
      graph.on('collapse-text:click', (e) => {
        handleCollapse(e)
      })
      graph.on('collapse-back:click', (e) => {
        handleCollapse(e)
      })
      graph.on('name-shape:click', (e) => {
        const tokenUid = e.item._cfg.model?.tokenUid
        if (tokenUid) router.push(`/mine/list/trace/view/${tokenUid}`)
      })

      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return
          if (!container || !container.scrollWidth || !container.scrollHeight) return
          graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
    }
  })

  useEffect(() => {}, [])

  return (
    <Card loading={loading}>
      <div ref={ref}></div>
      <div className={styles.footer}>
        <div className={styles.item}>碳总资产</div>
        <div className={styles.item}>上游碳币持有人</div>
      </div>
    </Card>
  )
}

export default Page
