import React from 'react'
import styles from './styles.less'
import beian from '@/assets/beian.png'

const Footer = () => {
  return (
    <div className={styles.container}>
      {/* <div>
        Copyright © 2019-2020 Hangzhou Chanlian Digital Technology Co., Ltd. All rights reserved.
        <br />
        <a target="_blank" rel="noopener noreferrer" href="http://www.beian.miit.gov.cn/">
          浙ICP备20000677号-5,{' '}
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010802010754"
        >
          <img src={beian} alt="" />
          浙公网安备号 33010802010754号
        </a>
        <br />
        浙网信备 33010819963715880033 号
      </div> */}
    </div>
  )
}

export default Footer
