import React from 'react'
import { Input, Form, Row, Col } from 'antd'

import { renderForm, DefaultLayout } from '@/utils/Form'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  style: { padding: '100px 400px' },
  colon: false
}

const Lay = (props) => {
  const { children, ...config } = props
  return (
    <Col span={12}>
      <DefaultLayout {...config}>{children}</DefaultLayout>
    </Col>
  )
}

const Asd = (props) => {
  const { form } = props

  const config = [
    {
      itemProps: {
        // Form.Item的API
        label: '测试1'
      },
      layout: {
        container: Lay
      },
      name: 't1',
      children: <Input placeholder="测试1" />
      // hidden: boolean || () => boolean 是否展示
    },
    {
      itemProps: {
        // Form.Item的API
        label: '测试2'
      },
      layout: {
        container: Lay
      },
      name: 't2',
      children: <Input placeholder="测试2" />
    },
    {
      itemProps: {
        // Form.Item的API
        label: '测试3'
      },
      layout: {
        container: Lay,
        props: { a: 1 }
      },
      name: 't3',
      children: <Input placeholder="测试2" />
    }
    // {
    //   itemProps: {
    //     // Form.Item的API
    //     label: '姓名'
    //   },
    //   condition: {
    //     // 单个校验规则
    //     required: true,
    //     name: '姓名',
    //     length: { max: 10, min: 1 }
    //   },
    //   name: 'name',
    //   children: <Input placeholder="姓名" />
    //   // hidden: boolean || () => boolean 是否展示
    // },
    // {
    //   itemProps: {
    //     label: '隐藏'
    //   },
    //   name: 'hide', // 字段名
    //   children: <Input placeholder="隐藏" />,
    //   hidden: () => true
    // },
    // {
    //   itemProps: {
    //     // Form.Item 的api
    //     label: '验证码'
    //   },
    //   name: 'code', // 字段名
    //   children: (
    //     <Row gutter={18}>
    //       <Col span={16}>
    //         <Input placeholder="验证码" />
    //       </Col>
    //       <Col span={8}>
    //         <Button>发送验证码</Button>
    //       </Col>
    //     </Row>
    //   )
    // },
    // {
    //   id: 'city', // id作为key
    //   itemProps: {
    //     label: '省市',
    //     required: true
    //   },
    //   layout: { container: RowLayout },

    //   children: [
    //     { name: 'province', layout: { container: ColLayout }, children: <Select /> },
    //     { name: 'city', layout: { container: ColLayout }, children: <Select /> }
    //   ]
    // }
  ]

  return (
    <Row>
      <Form {...formLayout}>
        {renderForm(config, {
          form,
          initialValue: {
            name: '默认名字'
          }
        })}
      </Form>
    </Row>
  )
}
export default Form.create()(Asd)
