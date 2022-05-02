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
import options from "./Data";

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

  //  提交按钮事件
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
              message.success('更新成功')
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
              scene:"分布式光伏",
              status:"在建",
              fileTime:moment(values.fileTime).format('YYYY-MM-DD'),
              startTime:moment(values.startTime).format('YYYY-MM-DD'),
              // place:place
            }).then((res) => {
              if (res instanceof Error) return
              message.success(`${id ? '更新' : '添加'}成功`)
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
      <Form.Item label="碳汇场景">
          {getFieldDecorator('methodScene', {
            rules: [
              {
                required: true,
                message: '请输入碳汇场景！'
              }
            ],
            initialValue: info?.extra?.methodScene||'分布式光伏'
          })(<Select style={{ width: 200 }} placeholder="请输入">
                <Select.Option value="分布式光伏" key="">
                  分布式光伏
                </Select.Option>
              </Select>
          // <Input style={{ width: 400 }} placeholder="请输入" />
          )}
        </Form.Item>

        {(role==='account_admin'||role==='account_super_admin')&&(<Form.Item label="企业名称">
          {getFieldDecorator('companyName', {
            rules: [
              {
                required: true,
                message: '请输入企业名称！'
              }
            ],
            initialValue: info?.extra?.companyName
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>)}

        <Form.Item label="项目名称">
          {getFieldDecorator('projectName', {
            rules: [
              {
                required: true,
                message: '请输入项目名称！'
              }
            ],
            initialValue: info?.extra?.projectName
          })(<Input style={{ width: 400 }} placeholder="请输入"/>)}
        </Form.Item>

        <Form.Item label="描述">
          {getFieldDecorator('desc', {
            rules: [
              {
                message: '请输入描述！'
              }
            ],
            initialValue: info?.extra?.desc
          })(
            <TextArea style={{ width: 600 }} rows={4} placeholder={"请输入"}/>
          )}
        </Form.Item>

        {/* <Row gutter={24}> */}
          <Form.Item label="项目地点">
            {/* <Col span={8}> */}
              {getFieldDecorator('place', {
                rules: [
                  {
                    required: true,
                    message: '请选择！',

                  }
                ],
                initialValue:  info?.extra?.place
              })(
                // style={{ width: 170, marginRight: 10 }}
                <Cascader style={{ width: 500 ,marginRight:800}} options={options} onChange={onChange} placeholder="选择地址"  />
              )}
            {/* </Col> */}
          {/* <Col span={8}> */}
            {getFieldDecorator('rest', {
              rules: [
                {
                  required: true,
                  message: '请选择市！',

                }
              ],
              initialValue: info?.extra?.rest
            })(
              <Input style={{ width: 500 }} placeholder={"请输入详细地址"}/>
            )}
          {/* </Col> */}
          </Form.Item>
        {/* </Row> */}

        <Form.Item label="建设规模">
          {getFieldDecorator('buildingScale', {
            rules: [
              {
                required: true,
                message: '请输入建设规模！'
              }
            ],
            initialValue: info?.extra?.buildingScale
          })(
            <Input addonAfter='KWP' style={{ width: 400 }} placeholder={"请输入"}/>
          )}
        </Form.Item>

        <Form.Item label="备案文件号">
          {getFieldDecorator('fileNum', {
            rules: [
              {
                required: true,
                message: '请输入备案文件号！'
              }
            ],
            initialValue: info?.extra?.fileNum
          })(
            <Input style={{ width: 400 }} placeholder="请输入"/>
          )}
        </Form.Item>

        <Form.Item label="备案时间">
          {getFieldDecorator('fileTime', {
            initialValue: moment(id === '' ? moment() : info?.extra?.fileTime),
            rules: [
              {
                required: true,
                message: '请输入备案时间！'
              }
            ],
          })(
            <DatePicker
              format="YYYY-MM-DD"
              // style={{ width: '100%' }}
              style={{ width: 400 }}
              placeholder="请输入"
            />
          )}
        </Form.Item>

        <Form.Item label="投产规模">
          {getFieldDecorator('scale', {
            rules: [
              {
                required: true,
                message: '请输入投产规模！'
              }
            ],
            initialValue: info?.extra?.scale
          })(
            <Input addonAfter='KWP' style={{ width: 400 }} placeholder={"请输入"}/>
          )}
        </Form.Item>

        <Form.Item label="开始(并网)时间">
          {getFieldDecorator('startTime', {
            initialValue: moment(id === '' ? moment() : info?.extra?.startTime),
            rules: [
              {
                required: true,
                message: '请输入开始(并网)时间！'
              }
            ],
          })(
            <DatePicker
              format="YYYY-MM-DD"
              // style={{ width: '100%' }}
              style={{ width: 400 }}
              placeholder="请输入"
            />
          )}
        </Form.Item>

        <Form.Item label="项目备案证/产权证明文件">
          {getFieldDecorator('attachment', {
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

          <Form.Item label="方法学版本">
          {getFieldDecorator('meiyongde', {
            rules: [
              {
                required: false,
              }
            ],
          })(
            // <DownloadItem list={[]} />
            <Button onClick={() => {
              localStorage.setItem("methoddetail", JSON.stringify('分布式光伏'))
              // router.push(`/methodMgr/view`,'_blank')
              window.open(`/methodMgr/view`, '_blank')
            }}>查看</Button>
            // <DownloadItem style={{ width: 400 }} list={methodfile?.extra?.methodFile||[]} />
          )}
        </Form.Item>
          {/*{getFieldDecorator('attachment', {*/}
          {/*  //   initialValue: (getItem()?.extra?.attachment || []).map((f) => ({*/}
          {/*  //   uid: f.uid,*/}
          {/*  //   name: f.name,*/}
          {/*  //   status: 'done',*/}
          {/*  //   url: f.url,*/}
          {/*  //   thumbUrl: '/matrix/biz-file/downloadFile?path=' + encodeURI(f.url)*/}
          {/*  // })),*/}

          {/*})(*/}
          {/*  <UploadNew*/}
          {/*    length={10}*/}
          {/*    size={20}*/}
          {/*    extra="请上传附件"*/}
          {/*    accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"*/}
          {/*    listType="picture"*/}
          {/*  >*/}
          {/*    <UploadButton />*/}
          {/*  </UploadNew>*/}
          {/*)}*/}
        <Form.Item {...buttonlayout} label=" ">
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

export default Form.create()(Add)
