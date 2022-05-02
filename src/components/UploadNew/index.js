import React, { Component } from 'react'
import { message, Upload } from 'antd'
import PropTypes from 'prop-types'
// import { QINIU_UPLOAD_URL, QINIU_DOWNLOAD_URL } from '../../utils/constant'
// import { uploadfunc } from '@/services/projectmanagement'
import styles from './style.less'
import UploadButton from '../UploadButton'

// 支持的 props 属性
// accept: 文件类型，image/jpg
// maxSize: 文件大小(单位字节) 2MB = 2*1024*1024字节
// imageAspect: 图片尺寸限制，格式（宽x高，eg: 100x300）
// fileName: 显示的文件名字，若不指定，则为一个随机字符串
// maxFileNum: 上传的最大文件个数，超过限制，自动禁用上传按钮
// listType: 上传列表的内建样式

export default class Uploader extends Component {
  static propTypes = {
    accept: PropTypes.string,
    maxSize: PropTypes.number,
    imageAspect: PropTypes.string,
    fileName: PropTypes.bool,
    maxFileNum: PropTypes.number,
    listType: PropTypes.string
  }

  static defaultProps = {
    accept: '*',
    maxSize: undefined,
    imageAspect: undefined,
    fileName: undefined,
    maxFileNum: 1,
    listType: undefined,
    extra: '',
    minLength: 0, // 至少几个文件
    length: 1, // 文件数量
    size: 5
  }

  constructor(props) {
    super(props)

    const { value: fileList, file } = this.props

    this.state = {
      fileList: fileList || [],
      uploadData: {}
    }
  }

  componentWillMount() {
    //通过getItem读取数据
    let token = JSON.parse(window.localStorage.getItem('token_key'))
    this.setState({
      uploadData: {
        Authorization: token
        // key: `${fileName || this.generateUUID()}.${fileType}`
      }
    })
  }

  // getUploadToken = () => {
  //   return new Promise((resolve, reject) => {
  //     uploadfunc()
  //       .then((response) => {
  //         if (response.data) {
  //           resolve(response.data)
  //         } else {
  //           message.error('获取 upload token 失败')
  //           reject()
  //         }
  //       })
  //       .catch(() => {
  //         reject()
  //       })
  //   })
  // }

  getImageAspect = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const data = e.target.result
        const image = new Image()

        image.onload = () => {
          const width = image.width || image.naturalWidth
          const height = image.height || image.naturalHeight
          resolve(`${width}x${height}`)
        }
        image.src = data
      }
      reader.readAsDataURL(file)
    })
  }

  //判断图片尺寸
  isImageAspectError = (aspect) => {
    const { imageAspect } = this.props

    if (imageAspect && imageAspect !== aspect) {
      message.error(`请上传尺寸为${imageAspect}px的图片`)
      return true
    }

    return false
  }

  //判断文件尺寸
  isFileSizeError = (fileSize) => {
    const { maxSize } = this.props

    if (maxSize && fileSize > maxSize) {
      message.error('文件大小超过限制')
      return true
    }

    return false
  }

  beforeUpload = async (file) => {
    const { fileName, imageAspect } = this.props
    const fileType = file.name.split('.').reverse()[0]

    // 判断文件大小限制是否正确
    if (this.isFileSizeError(file.size)) {
      return false
    }

    // 如果为图片，并且指定了尺寸，判断尺寸是否正确
    if (imageAspect && file.type.match(/image/)) {
      if (this.isImageAspectError(await this.getImageAspect(file))) {
        return false
      }
    }

    return new Promise((resolve, reject) => {
      resolve()
      // this.getUploadToken()
      //   .then((token) => {
      //     this.setState(
      //       {
      //         uploadData: {
      //           token,
      //           key: `${fileName || this.generateUUID()}.${fileType}`
      //         }
      //       },
      //       resolve
      //     )
      //   })
      //   .catch(() => {
      //     reject()
      //   })
    })
  }

  // generateUUID = () => {
  //   const s4 = () => {
  //     return Math.floor((1 + Math.random()) * 0x10000)
  //       .toString(16)
  //       .substring(1)
  //   }

  //   return `${s4() + s4()}-${new Date().getTime()}`
  // }

  onChange = ({ fileList, file }) => {
    const { onChange, value = [] } = this.props
    const tempFileList = []

    fileList.forEach((file) => {
      if (file.url) {
        console.log('nishi', file.url)
        return tempFileList.push(file.url)
      }
      if (file.response) {
        const { key } = file.response
        if (key) {
          console.log('keykey', key)
          return tempFileList.push(`/matrix/biz-file/localUpload${key}`)
          // return tempFileList.push(`${QINIU_DOWNLOAD_URL}${key}`)
        }
      }
    })
    if (value.length > 0 || tempFileList.length > 0) {
      onChange(tempFileList)
    }
    // this.setState({ fileList: [...tempFileList] });
    this.setState({ fileList })

    if (file.status == 'done') {
      const FileListobj = []

      fileList.forEach((file) => {
        console.log(file.response)
        FileListobj.push({
          url: file.response.data.fileAddress,
          uid: file.response.data.fileAddress,
          name: file.response.data.fileName
        })
      })
      console.log(FileListobj)
      console.log('donedone')
      onChange(FileListobj)
      return FileListobj
    }
  }

  getComputedClassName = () => {
    const { fileList } = this.state
    const { listType, cardStyle, maxFileNum } = this.props

    let className = listType === 'picture-card' ? `uploader-${cardStyle}` : ''

    if (fileList.length >= maxFileNum) {
      className = `${className} uploader-hidden-upload`
    }

    return className
  }

  getstyle = () => {
    const { fileList } = this.state
    const { listType, cardStyle, maxFileNum, children } = this.props

    let className = listType === 'picture-card' ? `uploader-${cardStyle}` : ''

    if (fileList.length >= maxFileNum) {
      return
    } else {
      return <div>{children}</div>
    }
  }

  render() {
    const { fileList, uploadData } = this.state
    const { accept, listType, children } = this.props
    const uploadProps = {
      action: '/matrix/biz-file/localUpload',
      // action: QINIU_UPLOAD_URL,
      accept,
      listType,
      className: this.getComputedClassName(),
      fileList,
      beforeUpload: this.beforeUpload,
      onChange: this.onChange,
      headers: this.state.uploadData
    }

    return (
      <div>
        <div className={styles.container}>
          <Upload {...uploadProps}>{this.getstyle()}</Upload>
        </div>

        <div>
          {this.props.extra ? (
            <div style={{ lineHeight: 1.6, color: 'rgba(0,0,0,0.45)', fontSize: 12, marginTop: 2 }}>
              <div>{this.props.extra}</div>
              <div>
                支持扩展名：
                {this.props.accept}； 数量及大小:限{this.props.maxFileNum}份 ，每个大小不超过
                {this.props.size}M
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
