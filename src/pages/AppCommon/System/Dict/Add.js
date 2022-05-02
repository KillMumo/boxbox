import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { Form, Row, Col, TreeSelect, Input, InputNumber, Button, message } from 'antd'
import Card from '@/components/Card'
import ButtonGroup from '@/components/ButtonGroup'
import { tree as getTree, addDict, getDictDetail, updateDict,getDictCodeById } from '@/services/dict'
import router from 'umi/router'
import { useRequest } from '@dragon/hooks'
import style from './style.css'


const { TextArea } = Input

const Add = (props) => {
  const {
    match: {
      params: { id }
    },
    form: { getFieldDecorator, validateFieldsAndScroll }
  } = props

  const { loading: getTreeLoading, data: tree = [] } = useRequest(getTree, {
    enhanceResponse: (data) => {
      return data.concat(
      //   {
      //   id: 0,
      //   title: '顶级',
      //   key: 0,
      //   value: 0
      // }
      )
    }
  })

  const { loading: getDictLoading, data: info = {}, start } = useRequest(getDictDetail, {
    manual: true
  })

  const { loading: addDictLoading, start: addDictReq } = useRequest(addDict, {
    manual: true
  })
  const { loading: updateDictLoading, start: updateDictReq } = useRequest(updateDict, {
    manual: true
  })
  const { loading: getCodeLoading, start: getCodeReq } =useRequest(getDictCodeById,{
    manual:true
  })

  useEffect(() => {
    if (id) {
      start(id)
    }
  }, [id, start])

  const formLayout = useMemo(
    () => ({
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    }),
    []
  )

  const[dictCode,setDictCode] =useState("")
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          const action = id ? updateDictReq : addDictReq
          action({
            prodCode:"micro_subsidy",
            ...values,
            id
          }).then((res) => {
            if (res instanceof Error) return
            message.success(`${id ? '更新' : '添加'}成功`)
            router.push('/system/dict')
          })
        }
      })
    },
    [addDictReq, id, updateDictReq, validateFieldsAndScroll]
  )
  const onChange = (val) => {
    if(val!==0){

      getCodeReq({
        id:val
      }).then(res=>{
        if (res instanceof Error) return
        console.log(res)
        setDictCode(res)


        props.form.setFieldsValue({code:res})

      })
    }else{
      setDictCode("")
      props.form.setFieldsValue({code:""})
    }

  };

  return (
    <Card loading={getTreeLoading || getDictLoading} transparent>
      <Form {...formLayout} hideRequiredMark onSubmit={handleSubmit}>
        <Card title="基本信息" bordered={false}>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="上级字典" >
                {getFieldDecorator('parentId', {
                  initialValue: info.parentId
                })(
                  <TreeSelect
                    id="select"
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={tree}
                    placeholder="请选择上级字典"
                    allowClear
                    showSearch
                    treeNodeFilterProp="title" onChange={onChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="字典码">
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '请输入字典码'
                    }
                  ],
                  initialValue: info.code
                })(<Input disabled={!!info.code || !!dictCode } id="code" placeholder="请输入字典码" className={(dictCode!==undefined||dictCode!="")?style.disabled:null}/>)}
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={24}>
              <Col span={10}>
                <Form.Item label="字典名称">
                  {getFieldDecorator('dictValue', {
                    initialValue: info.dictValue,
                    rules: [
                      {
                        required: true,
                        message: '请输入字典名称'
                      }
                    ]
                  })(<Input placeholder="请输入字典名称" />)}
                </Form.Item>
              </Col>

              <Col span={10}>
                <Form.Item label="字典值">
                  {getFieldDecorator('dictKey', {
                    rules: [
                      {
                        required: true,
                        message: '请输入字典值'
                      }
                    ],
                    initialValue: info.dictKey
                  })(<Input placeholder="请输入字典值" />)}
                </Form.Item>
              </Col>

          </Row>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item label="字典排序">
                {getFieldDecorator('sort', {
                  rules: [
                    {
                      required: true,
                      message: '请输入字典排序'
                    }
                  ],
                  initialValue: info.sort
                })(<InputNumber style={{ width: '100%' }} placeholder="请输入字典排序" />)}
              </Form.Item>
            </Col>
            {/*<Col span={10}>*/}
            {/*  <Form.Item label="产品码">*/}
            {/*    {getFieldDecorator('prodCode', {*/}
            {/*      rules: [*/}
            {/*        {*/}
            {/*          required: true,*/}
            {/*          message: '请输入产品码'*/}
            {/*        }*/}
            {/*      ],*/}
            {/*      initialValue: info.prodCode*/}
            {/*    })(<Input placeholder="请输入产品码" />)}*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}
          </Row>
        </Card>
        <Card title="其他信息" bordered={false}>
          <Row gutter={24}>
            <Col span={20}>
              <Form.Item labelAlign="left" label="字典备注">
                {getFieldDecorator('remark', {
                  initialValue: info.remark
                })(<TextArea rows={4} placeholder="请输入字典备注" />)}
              </Form.Item>
            </Col>
          </Row>
          <ButtonGroup>
            <Button loading={addDictLoading || updateDictLoading} type="primary" htmlType="submit">
              提交
            </Button>
          </ButtonGroup>
        </Card>
      </Form>
    </Card>
  )
}

export default Form.create()(Add)
