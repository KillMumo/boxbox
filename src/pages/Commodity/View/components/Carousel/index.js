import React, { useState } from 'react'
import styles from './styles.less'

const Carousel = (props) => {
  const { goodsImg = '' } = props

  // 提取出商品图片字符串中的url
  let arr = goodsImg.match(/\url+.*?\,/g) || []
  let images =
    arr.map((item) => {
      return item.slice(4, item.length - 1)
    }) || []

  // 记录展示图片的下标
  const [index, setIndex] = useState(0)

  const handleMouseEnter = (e, i) => {
    setIndex(i)
  }

  return (
    <React.Fragment>
      <div className={styles.box}>
        {images?.length !== 0 && <img className={styles.img} src={images[index]} alt="" />}
      </div>
      <div className={styles.swiper}>
        {[0, 1, 2, 3, 4].map((i) => {
          if (images[i]) {
            return (
              <div className={styles.thumbnail} onMouseEnter={(e) => handleMouseEnter(e, i)}>
                <img className={styles.img} src={images[i]} alt="" />
              </div>
            )
          } else {
            return <div className={styles.thumbnail}></div>
          }
        })}
      </div>
    </React.Fragment>
  )
}

export default Carousel
