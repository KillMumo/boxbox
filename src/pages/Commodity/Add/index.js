import React, { useEffect, useCallback } from 'react'
import Card from '@/components/Card'
import { Form, Button, Input, Select, Row, Col, Radio, message, Icon } from 'antd'
import { InputMoney, InputNumber } from '@/components/FormItems'
import Upload from '@/components/Upload'
import { validateFiles } from '@/utils/fieldValidator'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import { useRequest } from '@dragon/hooks'
import { fetchCommodityDetail } from '@/services/carbon/commodity'
import router from 'umi/router'
import { addCommodity, updateCommodity } from '@/services/carbon/commodity'
import { ContentUtils } from 'braft-utils'
import { TextArea } from '@/components/FormItems'

const uploadAccept = 'jpg,jpeg,bmp,png'

// 渲染说明
const renderDesc = (num, size, accept, format) => {
  return (
    <div style={{ color: 'rgba(0,0,0,0.45)' }}>
      <div>{'格式说明：'}</div>
      <div>{`1.仅支持${accept}格式的图片`}</div>
      <div>{`2.文件数量${num}，大小不超过${size}M`}</div>
      <div>{`3.尺寸为 ${format}`}</div>
    </div>
  )
}

const formLayout = {
  labelAlign: 'right',
  labelCol: { span: 3 },
  wrapperCol: { span: 7 },
  colon: false
}

const formTextLayout = {
  labelAlign: 'right',
  labelCol: { span: 3 },
  wrapperCol: { span: 15 },
  colon: false
}

const AddAndEdit = (props) => {
  const {
    form: { getFieldDecorator, setFieldsValue, validateFields, getFieldsValue },
    match: {
      params: { id }
    }
  } = props

  // 获取编辑页数据
  const { start: fetchDetail, loading: detailLoading } = useRequest(fetchCommodityDetail, {
    manual: true,
    onSuccess: async (data) => {
      console.log(data)
      setFieldsValue({
        // ...data,
        goodsDesc: BraftEditor.createEditorState(data.goodsDesc),
        goodsName: data.goodsName,
        goodsPrice: data.goodsPrice,
        stockTotal: data.stockTotal,
        goodsToken: data.goodsToken,
        goodsSummary: data.goodsSummary
      })
    }
  })

  useEffect(() => {
    if (!!id) {
      fetchDetail({ goodsId: id })
    }
  }, [fetchDetail, id])

  // 编辑提交
  // const { loading: updateLoading, start: updateReq } = useRequest(updateCommodity, {
  //   manual: true
  // })

  // 申请添加
  const { loading: submitLoading, start: submitReq } = useRequest(addCommodity, {
    manual: true,
    onSuccess: () => {
      router.push('/commodity/list')
      message.success('添加成功')
    }
  })

  // 添加/修改商品
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          const params = {
            ...values,
            // 富文本编辑器内容转化成html存储
            goodsDesc: values.goodsDesc.toHTML(),
            goodsPrice: Number(values.goodsPrice),
            goodsToken: Number(values.goodsToken),
            stockTotal: Number(values.stockTotal)
          }
          if (!!id) {
            const res = await submitReq(params)
            if (res instanceof Error) return
            message.success('编辑成功')
            router.push('/commodity/list')
          } else {
            // 无id->新增
            submitReq(params)
          }
        }
      })
    },
    [validateFields, id, submitReq]
  )

  // 富文本编辑器配置
  const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']

  // 图片上传oss后获取链接插入富文本编辑器中
  const uploadHandler = (result) => {
    const values = getFieldsValue()
    setFieldsValue({
      goodsDesc: ContentUtils.insertMedias(values.goodsDesc, [
        {
          type: 'IMAGE',
          url: result.url
        }
      ])
    })
  }

  // 富文本编辑器中上传组件配置
  const extendControls = [
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload
          accept={uploadAccept}
          showUploadList={false}
          listType="text"
          handler={uploadHandler}
        >
          <button type="button" className="control-item button upload-button" data-title="插入图片">
            <Icon type="picture" theme="filled" />
          </button>
        </Upload>
      )
    }
  ]

  return (
    <Card title="基本信息" loading={submitLoading || detailLoading}>
      <Form {...formLayout}>
        <Form.Item label="商品分类">
          {getFieldDecorator('goodsType', {
            rules: [
              {
                required: true,
                message: '请选择商品类型！'
              }
            ]
          })(
            <Select placeholder="请选择">
              <Select.Option key="节能产品" value="节能产品">
                节能产品
              </Select.Option>
              <Select.Option key="现金红包" value="现金红包">
                现金红包
              </Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formTextLayout} label="商品名称">
          {getFieldDecorator('goodsName', {
            rules: [
              {
                required: true,
                message: '请输入商品名称！'
              }
            ]
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formTextLayout} label="商品价格">
          <Row gutter={24}>
            <Col span={12}>
              {getFieldDecorator('goodsPrice', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品价格！'
                  }
                ]
                // })(<InputMoney precision={2} placeholder="请输入" addonAfter="元" isBottom={true} />)}
              })(<InputNumber placeholder="请输入" addonAfter="元" />)}
            </Col>
            <Col span={12}>
              {getFieldDecorator('goodsToken', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品价格！'
                  }
                ]
              })(<InputNumber placeholder="请输入" addonAfter="碳币" />)}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="库存">
          {getFieldDecorator('stockTotal', {
            rules: [
              {
                required: true,
                message: '请输入库存！'
              }
            ]
          })(<InputNumber placeholder="请输入" addonAfter="个" />)}
        </Form.Item>
        <Form.Item label="规格">
          {getFieldDecorator('goodsSpec', {
            rules: [
              {
                required: true,
                message: '请选择规格！'
              }
            ]
          })(
            <Radio.Group defaultValue="标准" buttonStyle="solid">
              <Radio.Button value="标准">标准</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item {...formTextLayout} label="商品图片">
          {getFieldDecorator('goodsImg', {
            rules: [
              {
                required: true,
                message: '请上传商品照片！'
              },
              { validator: validateFiles }
            ]
          })(<Upload accept={uploadAccept} minLength="1" length="5" size={5}></Upload>)}
          {renderDesc('1-5份', '5', uploadAccept, '600x600px')}
        </Form.Item>
        <Form.Item {...formTextLayout} label="商品简介">
          {getFieldDecorator('goodsSummary', {
            rules: [
              {
                message: '请输入商品简介！'
              }
            ]
          })(<TextArea max={100} placeholder="请输入" />)}
        </Form.Item>
        <Form.Item {...formTextLayout} label="商品详情">
          {getFieldDecorator('goodsDesc', {
            validateTrigger: 'onBlur',
            rules: [
              {
                required: true,
                validator: (_, value, callback) => {
                  if (value.isEmpty()) {
                    callback('请输入商品详情')
                  } else {
                    callback()
                  }
                }
              }
            ]
          })(
            <BraftEditor
              style={{ border: '1px solid #e8e8e8' }}
              controls={controls}
              placeholder="请输入商品详情"
              extendControls={extendControls}
            />
          )}
        </Form.Item>
        <Form.Item {...formTextLayout} label=" ">
          <Button
            // loading={updateLoading || submitLoading}
            loading={submitLoading}
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
          >
            保存
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => props.history.goBack()}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Form.create()(AddAndEdit)
