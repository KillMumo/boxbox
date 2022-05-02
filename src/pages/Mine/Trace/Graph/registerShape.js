import G6 from '@antv/g6'
const colors = {
  B: '#5B8FF9',
  R: '#F46649',
  Y: '#EEBC20',
  G: '#5BD8A6',
  DI: '#A7A7A7'
}

G6.registerNode(
  'flow-rect',
  {
    shapeType: 'flow-rect',
    draw(cfg, group) {
      const { traceDesc = '', assetToken, collapsed, status = 'B', rate = 1.0 } = cfg
      const grey = '#CED4D9'
      // 逻辑不应该在这里判断
      const rectConfig = {
        width: 202,
        height: 60,
        lineWidth: 1,
        fontSize: 14,
        fill: '#fff',
        radius: 4,
        stroke: grey,
        opacity: 1,
        cursor: 'pointer'
      }

      const nodeOrigin = {
        x: -rectConfig.width / 2,
        y: -rectConfig.height / 2
      }

      const textConfig = {
        textAlign: 'left',
        textBaseline: 'bottom'
      }

      const rect = group.addShape('rect', {
        attrs: {
          x: nodeOrigin.x,
          y: nodeOrigin.y,
          ...rectConfig
        }
      })

      const rectBBox = rect.getBBox()

      // label title
      group.addShape('text', {
        attrs: {
          ...textConfig,
          x: 12 + nodeOrigin.x,
          y: 20 + nodeOrigin.y,
          text: traceDesc.length > 28 ? traceDesc.substr(0, 28) + '...' : traceDesc,
          fontSize: 14,
          opacity: 0.85,
          fill: '#000'
        },
        name: 'name-shape'
      })

      // price
      group.addShape('text', {
        attrs: {
          ...textConfig,
          x: 12 + nodeOrigin.x,
          y: rectBBox.maxY - 12,
          text: assetToken,
          fontSize: 18,
          fill: '#000',
          opacity: 0.85
        }
      })

      // bottom line background
      group.addShape('rect', {
        attrs: {
          x: nodeOrigin.x,
          y: rectBBox.maxY - 4,
          width: rectConfig.width,
          height: 4,
          radius: [0, 0, rectConfig.radius, rectConfig.radius],
          fill: '#E0DFE3'
        }
      })

      // bottom percent
      group.addShape('rect', {
        attrs: {
          x: nodeOrigin.x,
          y: rectBBox.maxY - 4,
          width: rate * rectBBox.width,
          height: 4,
          radius: [0, 0, 0, rectConfig.radius],
          fill: colors[status]
        }
      })

      // collapse rect
      if (cfg.children && cfg.children.length) {
        group.addShape('rect', {
          attrs: {
            x: rectConfig.width / 2 - 8,
            y: -8,
            width: 16,
            height: 16,
            stroke: 'rgba(0, 0, 0, 0.25)',
            cursor: 'pointer',
            fill: '#fff'
          },
          name: 'collapse-back',
          modelId: cfg.id
        })

        // collpase text
        group.addShape('text', {
          attrs: {
            x: rectConfig.width / 2,
            y: -1,
            textAlign: 'center',
            textBaseline: 'middle',
            text: collapsed ? '+' : '-',
            fontSize: 16,
            cursor: 'pointer',
            fill: 'rgba(0, 0, 0, 0.25)'
          },
          name: 'collapse-text',
          modelId: cfg.id
        })
      }

      this.drawLinkPoints(cfg, group)
      return rect
    },
    update(cfg, item) {
      const group = item.getContainer()
      this.updateLinkPoints(cfg, group)
    },
    setState(name, value, item) {
      if (name === 'collapse') {
        const group = item.getContainer()
        const collapseText = group.find((e) => e.get('name') === 'collapse-text')
        if (collapseText) {
          if (!value) {
            collapseText.attr({
              text: '-'
            })
          } else {
            collapseText.attr({
              text: '+'
            })
          }
        }
      }
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5]
      ]
    }
  },
  'rect'
)

G6.registerEdge(
  'flow-cubic',
  {
    getControlPoints(cfg) {
      let controlPoints = cfg.controlPoints // 指定controlPoints
      if (!controlPoints || !controlPoints.length) {
        const { startPoint, endPoint, sourceNode, targetNode } = cfg
        const { x: startX, y: startY, coefficientX, coefficientY } = sourceNode
          ? sourceNode.getModel()
          : startPoint
        const { x: endX, y: endY } = targetNode ? targetNode.getModel() : endPoint
        let curveStart = (endX - startX) * coefficientX
        let curveEnd = (endY - startY) * coefficientY
        curveStart = curveStart > 40 ? 40 : curveStart
        curveEnd = curveEnd < -30 ? curveEnd : -30
        controlPoints = [
          { x: startPoint.x + curveStart, y: startPoint.y },
          { x: endPoint.x + curveEnd, y: endPoint.y }
        ]
      }
      return controlPoints
    },
    getPath(points) {
      const path = []
      path.push(['M', points[0].x, points[0].y])
      path.push(['C', points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y])
      return path
    }
  },
  'single-line'
)
