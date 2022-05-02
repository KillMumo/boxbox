import React from 'react'
import { Chart, Geom, Axis, Tooltip, Legend, View } from 'bizcharts'
import DataSet from '@antv/data-set'
import Slider from 'bizcharts-plugin-slider'
import { formatMoney } from '@/utils/index'
import styles from '../styles.less'

const ds = new DataSet({
  state: {
    start: 0,
    end: 1
  }
})

const label = {
  /**
   * 用于格式化坐标轴上显示的文本信息的回调函数
   * @param  {string} text  文本值
   * @param  {object} item  该文本值对应的原始数据记录
   * @param  {number} index 索引值
   * @return {string}       返回格式化后的文本值
   */
  formatter(text, item, index) {
    return text.length > 4 ? parseInt(text) / 10000 + '万' : text
  }
}

class SliderChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleSliderChange = (e) => {
    console.log(e)
    const { startRadio, endRadio } = e
    ds.setState('start', startRadio)
    ds.setState('end', endRadio)
  }

  render() {
    const { currentIndustry, data = [] } = this.props

    const cols = {
      amount: {
        tickCount: 6,
        alias: '担保总额(元)'
      },
      count: {
        tickCount: 6,
        alias: '企业数量'
      }
    }
    const dv = ds.createView().source(data)
    dv.transform({
      type: 'filter',
      callback(item, idx) {
        const radio = idx / data.length
        return radio >= ds.state.start && radio <= ds.state.end
      }
    })

    // const legendItems = [
    //   { value: '企业数量', marker: { symbol: 'circle', fill: '#FFC600', radius: 5 } },
    //   { value: '本行业企业', marker: { symbol: 'circle', fill: '#51C874', radius: 5 } },
    //   { value: '融资担保金额', marker: { symbol: 'circle', fill: '#1890FF', radius: 5 } }
    // ]

    return (
      <div>
        <div>
          <Chart height={400} padding={['auto', 60, 80, 60]} data={dv} scale={cols} forceFit>
            {/* <div className={styles.legendWrap}>
              {legendItems.map((item) => {
                return (
                  <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                    <div
                      className={styles.circle}
                      style={{ background: `${item.marker.fill}` }}
                    ></div>
                    <div className={styles.legend}>{item.value}</div>
                  </div>
                )
              })}
            </div> */}
            <div className={styles.axisWrap}>
              <div className={styles.axis}>担保总额(元)</div>
              <div className={styles.axis}>企业数量</div>
            </div>
            {/* <Legend custom allowAllCanceled items={legendItems} position="top-right" /> */}
            <Axis
              name="orgType"
              label={{
                rotate: 20,
                formatter(text, item, index) {
                  if (text.length > 8) {
                    return `${text.substr(0, 4)}...${text.substr(text.length - 3, text.length - 1)}`
                  } else {
                    return text
                  }
                }
              }}
            />
            <Axis name="amount" position="left" label={label} />
            <Tooltip />
            <Geom
              type="interval"
              position="orgType*amount"
              tooltip={[
                'orgType*amount',
                (orgType, amount) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等
                    name: '担保总额(元)',
                    title: orgType,
                    value: formatMoney(amount)
                  }
                }
              ]}
              color={[
                'orgType*amount',
                (orgType) => {
                  if (orgType === currentIndustry) {
                    return '#51C874'
                  } else {
                    return '#1890FF'
                  }
                }
              ]}
            />
            <View data={dv}>
              <Axis name="count" position="right" />
              <Axis name="orgType" label={null} />
              <Geom
                type="line"
                position="orgType*count"
                color="#FFC600"
                size={3}
                tooltip={[
                  'orgType*count',
                  (orgType, count) => {
                    return {
                      //自定义 tooltip 上显示的 title 显示内容等
                      name: '企业数量',
                      title: orgType,
                      value: count
                    }
                  }
                ]}
              />
            </View>
          </Chart>
        </div>
        <Slider
          data={data}
          padding={80}
          xAxis="orgType"
          yAxis="amount"
          textStyle={false}
          onChange={this.handleSliderChange}
        />
      </div>
    )
  }
}

export default SliderChart
