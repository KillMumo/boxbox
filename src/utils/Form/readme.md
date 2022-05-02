# @dragon/form

### 首先有几个比较重要的概念

- config
- Field
- Layout
- renderForm

## config
config是一个数组，描述出form长什么样子

### Api
```typescript
const config = [
  {
    id?: string, // 表单渲染出来的时候的key，有name时优先选择name
    name?: string, // 表单的键，getFieldValidator的第一个参数，同时会被当成id的key
    itemProps?: {}, // Form.Item的Api,
    layout?: { container: {}, props: {}}, // layout的配置
    children: React.Element | config[],
    hidden?: boolean | () => boolean // 是否显示表单域
  }
]
```

## Field

Field指的是getFieldValidator包裹的Element（包括getFieldValidator自己）

## Layout

Layout指的是Field的父元素，默认的是Form.Item

Layout支持自定义(layout.container)，同时也支持从config传入props (layout.props)，代码大概的样子可以参考DefaultLayout和BlankLayout

## renderForm

渲染表单的方法，接受两个参数：config、option，config指的就是上面的config，option里面可以传以个form实例（必传）和初始值 initialValue（选传）

## Demo
```jsx
import { RowLayout, ColLayout, renderForm } from '@/utils/Form'

const Asd = (props) => {
  const { form } = props

  const config = [
    {
      itemProps : { // Form.Item的API
        label: '姓名'
      },
      condition: { // 单个校验规则
        required: true,
        name: '姓名',
        length: { max: 10, min: 1 }
      },
      name: 'name',
      children: <Input placeholder="姓名" />,
      // hidden: boolean || () => boolean 是否展示
    },
    {
      itemProps : {
        label: '隐藏'
      },
      name: 'hide',  // 字段名
      children: <Input placeholder="隐藏" />,
      hidden: () => true,
    },
    {
      itemProps : {  // Form.Item 的api，只有默认layout的时候才有用
        label: '验证码'
      },
      name: 'code',  // 字段名
      children: (
        <Row gutter={18}>
          <Col span={16}>
            <Input placeholder="验证码" />
          </Col>
          <Col span={8}>
            <Button>发送验证码</Button>
          </Col>
        </Row>
      ),
    },
    {
      id: 'city', // id作为key
      itemProps : {
        label: '省市',
        required: true
      },
      layout: { container: RowLayout },

      children: [
        { name: 'province', layout: { container: ColLayout }, children: (<Select />) },
        { name: 'city', layout: { container: ColLayout }, children: (<Select />) },
      ]
    }
  ]

  return (
    <Form>
      {renderForm(config, {
        form,
        initialValue: {
          name: '默认名字'
        }
      })}
    </Form>
  )
}

```