import React, { useMemo } from 'react'
import styles from './styles.less'
import { useState } from 'react'

const data = [
  {
    step: '第一步：安装软件',
    title: '安装软件',
    desc: '在财务开票电脑上双击“泾渭助手·税票版.exe”图标安装插件',
    img: require('@/assets/downloadTips/step1.png'),
    active: true
  },
  {
    step: '第二步：填写税号',
    title: '填写税号',
    desc: '打开插件，选择需要上传的公司税号，并点击“确认”按钮',
    img: require('@/assets/downloadTips/step2.png'),
    active: false
  },
  {
    step: '第三步：授权机构',
    title: '授权机构',
    desc: '搜索并选择要授权的机构：杭州产链数字科技有限公司，阅读并同意授权协议',
    img: require('@/assets/downloadTips/step3.png'),
    active: false
  },
  {
    step: '第四步：销项采集',
    title: '销项采集',
    desc:
      '授权完成后首次将自动采集销项数据，自动上传过程有进度条提示进度，请不要关闭电脑或断开网络',
    img: require('@/assets/downloadTips/step4.png'),
    active: false
  },
  {
    step: '第五步：进项采集',
    title: '进项采集',
    desc: '继续采集进项数据需插入税盘，点击“自动采集——进项采集”，填写相应信息后点击确定',
    img: require('@/assets/downloadTips/step5.png'),
    active: false
  }
]

const Steps = (props) => {
  const [list, setList] = useState(data)

  const currentItem = useMemo(() => {
    return list.find((i) => i.active)
  }, [list])

  const set = (s) => {
    setList((l) =>
      l.map((i) => ({
        ...i,
        active: i.step === s
      }))
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        {list.map((i) => (
          <div
            onClick={() => set(i.step)}
            key={i.step}
            className={`${styles.stepItem} ${i.active ? styles.active : ''}`}
          >
            {i.step}
          </div>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{currentItem.title}</div>
        <div className={styles.desc}>{currentItem.desc}</div>
        <img style={{ width: '100%' }} src={currentItem.img} alt="" />
      </div>
    </div>
  )
}

export default Steps
