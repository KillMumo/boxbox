import { parse } from 'qs'
import moment from 'moment'

// 格式化金额 小数点保留两位 整数部分三位一段分开

// isDropZero 删去小数点后是全是0的
export function formatMoney(num, isDropZero = false) {
  const money = Number(num)
  if (isNaN(money)) {
    return isDropZero ? '0' : '0.00'
  }
  if (isDropZero) {
    return `${money}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  const moneyArr = `${money.toFixed(2)}`.split('.')
  return `${moneyArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${moneyArr[1]}`
}

export function isEmpty(o) {
  return o === undefined || o === '' || o === null
}

// 格式化文件列表，适用于以下情况
// const obj = {
//   'imageKey': 'url'
// }
// keys传 'url1', 'url2'
export function formatFileList(obj, ...keys) {
  return keys.map((key) => ({
    uid: key,
    name: key,
    status: 'done',
    url: obj[key]
  }))
}

// 检查是否有按钮权限
export function checkAuth(code) {
  return window.g_app._store.getState().authorities.button.buttons.includes(code)
}

// 格式化url列表，适用于以下情况：
// const urls = {
//   'imageKey1': 'url',
//   'imageKey2':[
//     {
//       'imageKey11': 'url11',
//       'imageKey12': 'url12',
//     }
//   ]
// }
export function format(urls) {
  if (!urls) return []
  return Object.keys(urls).map((key) => {
    const urlArray = Array.isArray(urls[key]) ? urls[key] : [urls[key]]
    return urlArray.map((url) => ({
      uid: url,
      name: url,
      status: 'done',
      url
    }))
  })
}

// 获取文件后缀名
export function getFileExecName(url) {
  const temp = url.split('/')
  const filename = temp[temp.length - 1]
  const filenameWithoutSuffix = filename.split(/#|\?/)[0]
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0]
}

/**
 *锚点滚动
 *
 * @export
 * @param {*} anchorName
 */
export function scrollToAnchor(anchorName) {
  if (anchorName) {
    // 找到锚点
    let anchorElement = document.getElementById(anchorName)
    // 如果对应id的锚点存在，就跳转到锚点
    if (anchorElement) {
      anchorElement.scrollIntoView()

      // window.scrollBy({top: -100, behavior: 'smooth'})
      if (anchorElement.getBoundingClientRect().top < 100) {
        window.scrollBy({ top: -100, behavior: 'smooth' })
      }
      // anchorElement.scrollTop += 100
    }
  }
}

// 格式化url
export function encodeUrl(url) {
  const temp = url.split('Signature')
  temp[0] = temp[0]
    .replace(/:/g, '%3A')
    .replace(/\+/g, '%2B')
    .replace(/ /g, '%20')
    .replace(/\//g, '%2F')
    .replace(/\?/g, '%3F')
    .replace(/#/g, '%23')
    .replace(/&/g, '%26')
    .replace(/=/g, '%3D')
  temp[1] = encodeURIComponent(temp[1])
  return temp.join('Signature')
}

// 格式化时间(删除时分秒)
export function formatDate(date) {
  if (date && date.length > 8) {
    const suffix = date.substring(date.length - 8, date.length)
    if (suffix[2] === ':' && suffix[5] === ':') {
      return date.substring(0, date.length - 8)
    }
  }
  return date
}

// 获取当前日期
export function getCurrentDate() {
  const date = new Date()
  let res = ''
  if (date && date.toJSON().length > 10) {
    res = date
      .toJSON()
      .substring(0, 10)
      .split('-')
  }
  return res.join('')
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1])
}

/**
 *
 *时间戳转时间字符串
 * @export
 * @param {String Number} time 时间戳
 * @param {String} type
 * @param {*} empty 为空时返回的值
 * @returns {String} 时间
 */
export function formatTime(time, type, empty = '-') {
  if (!+time) return empty
  switch (type) {
    case 'ymd':
      return moment(+time).format('YYYY-MM-DD')
    case 'ymdhms':
      return moment(+time).format('YYYY-MM-DD HH:mm:ss')
    case 'ym':
      return moment(+time).format('YYYY-MM')
    case 'moment':
      return moment(+time)
    default:
      return moment(+time).format('YYYY-MM-DD HH:mm:ss')
  }
}

// 打开新页面
export function windowOpen(url) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  a.click()

  return
}

// 判断一个对象是否至少有一个属性不为空
export function isObjectNull(obj = {}) {
  return Object.entries(obj).reduce((current, item) => {
    const isArray = Array.isArray(item[1])
    if (!current) return current
    if (!isEmpty(item[1]) && !isArray) {
      return false
    }
    if (isArray && item[1].length) {
      return false
    }
    return current
  }, true)
}

/**
 * 将"2018-05-19T08:04:52.000+0000"这种格式的时间转化为正常格式
 * @param time
 */
export function timeFormat(time, type, empty = '-') {
  const timeString = Date.parse(
    time
      ?.slice(0, 19)
      .replace(/-/g, '/')
      .replace(/T/g, ' ')
  )
  return formatTime(timeString, type, empty)
}

export const fileNameReg = /^([0-9]|[a-z]|[A-Z]|[\u4e00-\u9fa5]){1,30}$/

// 文件名
export function checkFileName(rule, value, callback) {
  if (value && !fileNameReg.test(value)) {
    callback('文件名称过长或包含非法字符，最大长度为30字符，只允许中文、英文、数字！')
  } else {
    callback()
  }
}
