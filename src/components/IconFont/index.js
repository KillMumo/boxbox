import { Icon } from 'antd'
import styles from './styles.less'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2758505_2127mf7d721.js',
  extraCommonProps: {
    className: styles.icon
  }
})

export default IconFont
