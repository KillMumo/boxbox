import React from 'react'
import styles from './index.less'
// import { useRequest } from '@dragon/hooks'
// import { fetchProductInfo } from '@/services/common'
// import { useSelector } from 'react-redux'
// import logo from '../../assets/logo/logo.jpg'
// import logo from '@/pages/User/Login/image/accountLogo.png'
import logo from '@/pages/User/Login/image/盒子.png'

const GlobalHeader = (props) => {
  const { right, left, burger } = props

  // const prodCode = useSelector(({ prodCode }) => prodCode)
  // const { data = {} } = useRequest(() => fetchProductInfo({ prodCode }))
  // redux数据
  // const { pageConfig } = useSelector(({ pageConfig }) => ({
  //   pageConfig
  // }))

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.left}>
          {burger}
          <img className={styles.logo} src={logo} alt="" />
          <div className={styles.prodName}>包装盒型管理系统</div> 
          {/* <img className={styles.logo} src={logo} alt="" /> */}
          {/* <div className={styles.prodName}>碳链</div> */}
        </div>
        <div className={styles.leftTitle}>{left}</div>
        <div className={styles.right}>{right}</div>
      </div>
    </header>
  )
}

export default GlobalHeader
