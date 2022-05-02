import React from 'react'
import Exception from '@/components/Exception'
// import logo from '@/assets/msFinance/logo.png'
import { fetchPageConfig } from '@/common/pageConfig'

const style = {
  padding: '30px 0 0 120px',
  fontSize: '22px',
  fontWeight: '500',
  color: 'rgba(0, 0, 0, 0.85)'
}

const pageConfig = fetchPageConfig()

const Exp = () => {
  return (
    <React.Fragment>
      <div style={style}>
        <img
          style={{ width: 32, verticalAlign: 'top', marginRight: 8 }}
          src={pageConfig?.icon || ''}
          alt=""
        />
        {pageConfig?.name || ''}
      </div>
      <Exception code={500} desc="很抱歉! 页面暂时无法访问，正在紧急修复中" />
    </React.Fragment>
  )
}

export default Exp
