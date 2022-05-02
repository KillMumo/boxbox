import React, { useEffect } from 'react'
import { Icon } from 'antd'
import classnames from 'classnames'
import styles from './styles.less'
import { previewUrl } from '@/common/config'
import { encodeUrl } from '@/utils'
import IconFont from '@/components/IconFont'
import { getUrl } from '@/services/carbon/common'

// name: 文件名：
// url: 文件地址
// block: 是否占据一行
// lists: 用数组传入，则不需要传name 和url，自动遍历
const DownloadItem = ({ name, url = '', list, block = false }) => {
  const iconMap = {
    pdf: 'iconpdf',
    doc: 'iconword',
    docx: 'iconword',
    xls: 'iconexcel',
    xlsx: 'iconexcel'
  }

  const renderItem = ({ name, url, block, key }) => {
    const url2 = url
    const getdownload = () => {
      console.log('urllll', url2)
      getUrl({ path: url2 }).then((res) => {
        // console.log('uuuuu', res)
        // return res
      })
    }
    const renderName = () => {
      const index = name.lastIndexOf('.')
      const suffix = name.substr(index + 1)
      // console.log('11111', suffix === 'png')
      // const handlePreview = (url) => {
      //   window.open(`${previewUrl}${encodeUrl(url)}`)
      // }

      if (suffix === 'png' || suffix === 'jpg' || suffix === 'jpeg') {
        return (
          <React.Fragment>
            <img
              src={'/matrix/biz-file/downloadFile?path=' + encodeURI(url2)}
              alt=""
              className={styles.pic}
            />
            <span className={`${styles.name} ${styles.pointer}`}>
              {/* <span className={`${styles.name} ${styles.pointer}`} onClick={() => handlePreview(url)}> */}
              {name}
            </span>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <IconFont type={iconMap[suffix]} style={{ fontSize: 28 }} />
            <span className={`${styles.name} ${styles.pointer}`}>
              {/* <span className={`${styles.name} ${styles.pointer}`} onClick={() => handlePreview(url)}> */}
              {name}
            </span>
          </React.Fragment>
        )
      }
    }

    const className = classnames({
      [styles.container]: true,
      [styles.block]: !!block
    })

    return (
      <div key={key} className={className}>
        {renderName()}
        <Icon
          style={{ fontSize: 18, marginLeft: 'auto' }}
          type="download"
          // onClick={() => window.open(url2)}
          // onClick={getUrl({ path: url2 })}
          // onClick={() => window.open(getdownload())}
          onClick={() => window.open('/matrix/biz-file/downloadFile?path=' + encodeURI(url2))}
        />
      </div>
    )
  }

  if (list && list.length !== 0) {
    return list.map((i) => renderItem({ name: i.name, url: i.url, block, key: i.url }))
  }

  if (list && list.length === 0) {
    return '无'
  }

  return renderItem({ name, url, block })
}

// function encode(url) {
//   return url
//     .replace(/:/g, '%3A')
//     .replace(/\+/g, '%2B')
//     .replace(/ /g, '%20')
//     .replace(/\//g, '%2F')
//     .replace(/\?/g, '%3F')
//     .replace(/#/g, '%23')
//     .replace(/&/g, '%26')
//     .replace(/=/g, '%3D')
// }
export default DownloadItem
