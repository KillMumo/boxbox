import React, { useCallback, useEffect, useState} from 'react'
import Card from '@/components/Card'
import { Form, Input, Button, Select,message} from 'antd'
import { addBox } from '@/services/box'
import UploadNew from '@/components/UploadNew'
import UploadButton from '@/components/UploadButton'
import { useRequest } from '@dragon/hooks'
import router from 'umi/router'

const Add = (props) => {
  const {
    form: { getFieldDecorator, validateFields,getFieldsValue }
  } = props

  const formLayout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    colon: true
  }
  const buttonlayout = {
    labelAlign: 'right',
    labelCol: { span: 11 },
    wrapperCol: { span: 13 },
    colon: false
  }

  // const handleSubmit = useCallback(
  //   (e) => {
  //     e.preventDefault()
  //     validateFields(async (err, values) => {
  //       if (!err) {
  //         const res = await submit({
  //           ...values
  //         })
  //         if (res instanceof Error) {
  //           fetchGraph()
  //           return
  //         }
  //         dispatch({
  //           type: 'modifyPhone/save',
  //           payload: values
  //         })
  //       }
  //     })
  //   },
  //   [dispatch, fetchGraph, graph.graphId, submit, validateFields]
  // )

  // const { start: submitReq } = useRequest(addBox, {
  //   manual: true,
  //   onSuccess: () => {
  //     router.push('/dataManagement/allList')
  //     message.success('新增成功')
  //   }
  // })

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          // values.optTime = moment(values.optTime).format('YYYY-MM-DD HH:mm:ss');
          const params = {
            // bizNo:getmethoddata().bizNo,
            ...values
          }
          // console.log('ggggggggggg',params)
          addBox(params)
        }
      })
    },
    [validateFields]
  )

  return (
    <Card>
      <Form {...formLayout}>
      <Form.Item label="供应商名称">
          {getFieldDecorator('companyname', {
            rules: [
              {
                required: true,
                message: '请输入供应商名称！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item label="供应商地址">
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: '请输入企业地址！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item label="联系人姓名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入联系人姓名！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item label="联系人电话">
          {getFieldDecorator('number', {
            rules: [
              {
                required: true,
                message: '请输入联系人电话！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item label="成品盒长">
          {getFieldDecorator('finallength', {
            rules: [
              {
                required: true,
                message: '请输入成品盒长！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入" addonAfter="mm"/>)}
        </Form.Item>

        <Form.Item label="成品盒宽">
          {getFieldDecorator('finalwidth', {
            rules: [
              {
                required: true,
                message: '请输入成品盒宽！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入" addonAfter="mm"/>)}
        </Form.Item>

        <Form.Item label="成品盒高">
          {getFieldDecorator('finalheight', {
            rules: [
              {
                required: true,
                message: '请输入成品盒高！'
              }
            ]
          })(<Input style={{ width: 400 }} placeholder="请输入" addonAfter="mm"/>)}
        </Form.Item>

        <Form.Item label="盒型种类">
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请输入成品盒高！'
              }
            ]
          })(<Select style={{ width: 400 }} placeholder="请选择" >
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="扣盖式">扣盖式</Select.Option>
            <Select.Option value="手提式">手提式</Select.Option>
            <Select.Option value="粘接式">粘接式</Select.Option>
            <Select.Option value="两页式">两页式</Select.Option>
            <Select.Option value="套盖式">套盖式</Select.Option>
            <Select.Option value="摇盖盒">摇盖盒</Select.Option>
            <Select.Option value="抽屉式">抽屉式</Select.Option>
            <Select.Option value="其他">其他</Select.Option>
          </Select>)}
        </Form.Item>

        <Form.Item label="数字文件">
          {getFieldDecorator('boxfile', {
            // initialValue: (getItem()?.extra?.attachment || []).map((f) => ({
            //   uid: f.uid,
            //   name: f.name,
            //   status: 'done',
            //   url: f.url,
            //   thumbUrl: '/matrix/biz-file/downloadFile?path=' + encodeURI(f.url)
            // })),
            rules: [
              {
                required: false,
                message: '请上传其他附件！'
              }
            ]
          })(
            <UploadNew
              minLength="0"
              length="10"
              // maxFileNum="10"
              size="20"
              extra="请上传其他附件"
              accept=".zip,.rar,.doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
              listType="picture"
            >
              <UploadButton />
            </UploadNew>
          )}
          </Form.Item>

        
        <Form.Item {...buttonlayout} label=" ">
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
          >
            新增
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => props.history.goBack()}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)