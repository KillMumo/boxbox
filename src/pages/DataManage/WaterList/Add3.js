import React, { useCallback, useEffect, useState} from 'react'
import Card from '@/components/Card'
import { Form, Row, Col, Input, Button, Select, DatePicker, message, InputNumber, Cascader } from 'antd'
import { useRequest } from '@dragon/hooks'
import { addReduction, fetchDetail, getItem, saveItem, updateReduction ,getMethodList} from '@/services/carbonAccount/reduction'
import router from 'umi/router'
import moment from 'moment'
import TextArea from 'antd/es/input/TextArea'
import { validateFiles } from '@/utils/fieldValidator'
import UploadNew from '@/components/UploadNew'
import UploadButton from '@/components/UploadButton'
import DownloadItem from '@/components/DownloadItem'
import { useSelector } from 'react-redux'
// import options from "./Data";

const Add = (props) => {
  const formLayout = {
    labelAlign: 'right',
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    colon: true
  }
  const itemlayout = {
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

  const {
    form: { getFieldDecorator, validateFields },
    match: {
      params: { id }
    }
  } = props

  const role = useSelector(({ user }) => user.role)

  // console.log('rooole',role)

  const { loading: submitLoading, start: submitReq } = useRequest(addReduction, {
    manual: true
  })

  const { loading: getWasteLoading, data: info = {}, start } = useRequest(fetchDetail, {
    manual: true
  })

  const { loading: updateWasteLoading, start: updateReq } = useRequest(updateReduction, {
    manual: true
  })
  let place={}
  function onChange(value, selectedOptions) {
    console.log(value, selectedOptions);

  }
useEffect(()=>{
  if(!id){
    saveItem([])
  }
},[])
  useEffect(() => {
    if (id) {
      start({ bizNo: id })
    }
  }, [id, start])
  console.log(info)

  const [methodfile,setmethodfile]=useState([])

  const requestMethod=()=>{
    getMethodList().then((res)=>{
      // console.log('mettttthod',res.records[0])
      setmethodfile(res.records[0])
    })
  }

  useEffect(() => {
    requestMethod()
  },[])

  //  ??????????????????
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFields((err, values) => {
        if (!err) {
          const action = id ? updateReq : submitReq
          if(id){
            updateReq({
              ...values,
              bizNo: id
            }).then((res) => {
              if (res instanceof Error) return
              message.success('????????????')
              router.push('/reduction/list')
            })
          }else{

            let arr = values.place
            if(arr.length===2){
              place.province=arr[0]
              place.city=arr[0]
              place.area=arr[1]

            }else if(arr.length===3){
              place.province=arr[0]
              place.city=arr[1]
              place.area=arr[2]
            }
            place.rest=values.rest
            // console.log(place)
            submitReq({
              ...values,
              bizNo: id,
              scene:"???????????????",
              status:"??????",
              fileTime:moment(values.fileTime).format('YYYY-MM-DD'),
              startTime:moment(values.startTime).format('YYYY-MM-DD'),
              // place:place
            }).then((res) => {
              if (res instanceof Error) return
              message.success(`${id ? '??????' : '??????'}??????`)
              router.push('/reduction/list')
            })
          }

        }
      })
    },
    [id, submitReq, updateReq, validateFields]
  )

  return (
    <Card loading={getWasteLoading}>
      <Form {...formLayout}>
      <Form.Item label="???????????????">
          {getFieldDecorator('companyname', {
            rules: [
              {
                required: true,
                message: '???????????????????????????'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Input style={{ width: 400 }} placeholder="?????????"/>)}
        </Form.Item>

        <Form.Item label="???????????????">
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: '????????????????????????'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Input style={{ width: 400 }} placeholder="?????????"/>)}
        </Form.Item>

        <Form.Item label="???????????????">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '???????????????????????????'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Input style={{ width: 400 }} placeholder="?????????"/>)}
        </Form.Item>

        <Form.Item label="???????????????">
          {getFieldDecorator('number', {
            rules: [
              {
                required: true,
                message: '???????????????????????????'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Input style={{ width: 400 }} placeholder="?????????"/>)}
        </Form.Item>

        <Form.Item label="????????????">
          {getFieldDecorator('finallength', {
            rules: [
              {
                required: true,
                message: '????????????????????????'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Input style={{ width: 400 }} placeholder="?????????" addonAfter="mm"/>)}
        </Form.Item>

        <Form.Item label="????????????">
          {getFieldDecorator('finalwidth', {
            rules: [
              {
                required: true,
                message: '????????????????????????'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Input style={{ width: 400 }} placeholder="?????????" addonAfter="mm"/>)}
        </Form.Item>

        <Form.Item label="????????????">
          {getFieldDecorator('finalheight', {
            rules: [
              {
                required: true,
                message: '????????????????????????'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Input style={{ width: 400 }} placeholder="?????????" addonAfter="mm"/>)}
        </Form.Item>

        <Form.Item label="????????????">
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '????????????????????????'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Select style={{ width: 400 }} placeholder="?????????"/>)}
        </Form.Item>

        <Form.Item label="????????????">
          {getFieldDecorator('boxfile', {
            initialValue: (getItem()?.extra?.attachment || []).map((f) => ({
              uid: f.uid,
              name: f.name,
              status: 'done',
              url: f.url,
              thumbUrl: '/matrix/biz-file/downloadFile?path=' + encodeURI(f.url)
            })),
            rules: [
              {
                required: true,
                message: '????????????????????????'
              }
            ]
          })(
            <UploadNew
              minLength="0"
              length="10"
              // maxFileNum="10"
              size="20"
              extra="?????????????????????"
              accept=".zip,.rar,.doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
              listType="picture"
            >
              <UploadButton />
            </UploadNew>
          )}
          </Form.Item>

        
        <Form.Item {...buttonlayout} label=" ">
          <Button
            // loading={updateLoading || submitLoading}
            loading={submitLoading}
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
          >
            ??????
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => props.history.goBack()}>
            ??????
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)
