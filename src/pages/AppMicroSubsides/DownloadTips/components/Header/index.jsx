import React from 'react'
import styles from './styles.less'
import IconFont from '@/components/IconFont'
import { Modal } from 'antd'
import { useBool } from '@dragon/hooks'

const videoUrl =
  'http://matrix-prod-env.oss-cn-shanghai.aliyuncs.com/%E6%B3%BE%E6%B8%AD%E5%8A%A9%E6%89%8B%C2%B7%E6%93%8D%E4%BD%9C%E6%AD%A5%E9%AA%A4.mp4?Expires=3061109031&OSSAccessKeyId=LTAI4FuLTur8d4hyP2dPwhL2&Signature=eJqi1t1D8bkxqo3cf2o7GyHGejU%3D'

const softwareUrl =
  'http://matrix-prod-env.oss-cn-shanghai.aliyuncs.com/%E6%B3%BE%E6%B8%AD%E5%8A%A9%E6%89%8B%C2%B7%E7%A8%8E%E7%A5%A8%E7%89%88.zip?Expires=3061885065&OSSAccessKeyId=LTAI4FuLTur8d4hyP2dPwhL2&Signature=jVGNsly%2BvLwGewDZPCu5ioURawg%3D'

const Header = (props) => {
  const [visible, { toggle }] = useBool(false)

  const renderModal = () => {
    return (
      <Modal
        bodyStyle={{ padding: 48 }}
        width={1100}
        footer={null}
        onCancel={() => toggle(false)}
        visible={visible}
      >
        <video controls style={{ width: '100%' }} src={videoUrl} />
      </Modal>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>泾渭助手</div>
      <div className={styles.subtitle}>税票版</div>
      <div className={styles.action}>
        <div onClick={() => window.open(softwareUrl)} className={styles.button}>
          <IconFont type="iconchajianxiazai" />
          下载使用
        </div>
        <div onClick={() => toggle(true)} className={styles.button}>
          <IconFont type="iconbofang" />
          视频教程
        </div>
      </div>
      {renderModal()}
    </div>
  )
}

export default Header
