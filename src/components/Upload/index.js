import React, { useState, useCallback, useMemo } from 'react'
import { Upload as UploadComp, Icon, Modal, message } from 'antd'
import OSS from 'ali-oss'
import { useBoolean } from '@dragon/hooks'
import { FileNameReg } from '@/common/reg'
import styles from './styles.less'
import { getOssToken } from '@/services/common'
import { useSelector } from 'react-redux'
import { getFileExecName, encodeUrl } from '@/utils'
import { previewUrl } from '@/common/config'

const Upload = React.forwardRef(
  (
    {
      value: fileList = [],
      onChange,
      minLength = 0, // 至少几个文件
      length = 1, // 文件数量
      listType = 'picture-card', // upload类型
      accept = 'jpg,jpeg,bmp,png', // 支持的格式
      size = 5, // 单个文件的大小 单位mb
      showOnly = false, // 是否只读
      extra, // 额外显示的文本
      children,
      example,
      handler,
      ...props
    },
    ref
  ) => {
    const [previewImage, setPreviewImg] = useState('')
    const { state: previewVisible, setTrue: openPreview, setFalse: closePreview } = useBoolean()

    const { user } = useSelector(({ user }) => user)

    // 进行预览
    const handlePreview = useCallback(
      async (file) => {
        const execName = getFileExecName(file.url)
        if (['.jpg', '.jpeg', '.png', '.bmp'].includes(execName)) {
          setPreviewImg(file.url || file.preview)
          openPreview()
        } else {
          window.open(`${previewUrl}${encodeUrl(file.url)}`)
        }
      },
      [openPreview]
    )

    // 改变时触发
    const handleChange = useCallback(
      ({ file, fileList }) => {
        // 当前改变的文件，所有的文件
        if (onChange) {
          onChange(fileList)
        }
      },
      [onChange]
    )

    const beforeUpload = useCallback(
      (file, fileList) => {
        // 当前增加的文件和文件list
        const fileName = file.name.substring(0, file.name.lastIndexOf('.'))
        return new Promise((resolve, reject) => {
          if (file.size / 1024 / 1024 > size) {
            message.error(`文件不能超过${size}M`)
            reject()
            return
          }
          if (!FileNameReg.test(fileName)) {
            message.error('文件名称过长或包含非法字符，最大长度为30字符，只允许中文、英文、数字')
            reject()
            return
          }
          resolve()
        })
      },
      [size]
    )

    // 上传按钮children
    const renderUploadButton = useCallback(
      () =>
        !showOnly &&
        (children ? (
          children
        ) : (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传</div>
          </div>
        )),
      [children, showOnly]
    )

    // 接受的类型
    const realAccept = useMemo(
      () =>
        accept
          .split(',')
          .map((i) => `.${i}`)
          .join(','),
      [accept]
    )

    const customRequest = useCallback(
      ({ file, onSuccess, onError, onProgress }) => {
        getOssToken().then(async (res) => {
          if (res instanceof Error) return
          const resultOss = await oss(res, file, user, {
            onSuccess,
            onError,
            onProgress
          })
          const lists = fileList.concat(resultOss)
          handleChange({ fileList: lists })
          // 图片上传成功后插入文本编辑器中
          if (handler) {
            handler(resultOss)
          }
        })
      },
      [fileList, handleChange, user, handler]
    )

    // 预览示例图
    const handleExample = useCallback(
      async (pic) => {
        setPreviewImg(pic)
        openPreview()
      },
      [openPreview]
    )

    return (
      <div>
        <div className={styles.container}>
          <UploadComp
            ref={ref}
            showUploadList={{
              showRemoveIcon: !showOnly,
              showDownloadIcon: false
            }}
            accept={realAccept}
            listType={listType}
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            customRequest={customRequest}
            {...props}
          >
            {fileList.length < length && renderUploadButton()}
          </UploadComp>
          {example && (
            <div className={styles.exampleContainer}>
              <img className={styles.pic} src={example} alt="" />
              <div className={styles.text}>
                示例图&nbsp;&nbsp;
                <Icon
                  type="zoom-in"
                  onClick={() => {
                    handleExample(example)
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          {extra ? (
            <div style={{ lineHeight: 1.6, color: 'rgba(0,0,0,0.45)', fontSize: 12, marginTop: 2 }}>
              <div>{extra}</div>
              <div>
                支持扩展名：
                {accept
                  .split(',')
                  .map((i) => `.${i}`)
                  .join(' ')}
                ； 数量及大小:
                {length === minLength ? '限1' : `${minLength}-${length}`}份，每个大小不超过{size}M
              </div>
            </div>
          ) : null}
          <Modal
            wrapClassName={styles.wrap}
            visible={previewVisible}
            footer={null}
            onCancel={() => closePreview()}
          >
            <img style={{ width: '100%' }} src={previewImage} alt="" />
          </Modal>
        </div>
      </div>
    )
  }
)

export default Upload

export async function oss(data, file, userInfo, handle) {
  const { onSuccess, onError, onProgress } = handle

  // const { account, userName } = userInfo

  const bucket = `matrix-${process.env.API}-env`

  const clientWrite = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: data.accessKeyId,
    accessKeySecret: data.accessKeySecret,
    stsToken: data.securityToken,
    secure: true,
    endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
    bucket
  })

  const exec = getFileExecName(file.name)
  const fileName = file.name.replace(exec, '')

  const objectKey = `${fileName}-${Date.now()}${exec}`

  const result = await clientWrite.multipartUpload(objectKey, file, {
    progress: (p) => {
      onProgress({ percent: p * 100 })
    }
  })

  try {
    if (result.res.status === 200) {
      onSuccess(result.res, file)

      const clientRead = new OSS({
        region: 'oss-cn-shanghai',
        accessKeyId: 'LTAI4FuLTur8d4hyP2dPwhL2',
        accessKeySecret: 'Y1ii6ocNcTaVaKLPhzeAfiaQZ9Iiua',
        endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
        bucket
      })

      const url = await clientRead.signatureUrl(objectKey, {
        expires: 50 * 365 * 24 * 3600
      })

      return {
        uid: url,
        url,
        name: file.name,
        status: 'done'
      }
    } else {
      throw new Error('上传失败')
    }
  } catch (e) {
    message.error('上传失败')
    onError(e, result, file)
    return Promise.reject(e)
  }
}
