import React from 'react'
import { usePageContext, enhanceConfig } from '../store'
import { renderForm } from '@/utils/Form'
import Dynamic from './Dynamic'
import AddButton from './AddButton'
import Card from '@/components/Card'
import { Form, Radio, Icon } from 'antd'

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
  colon: false
}

const Paragraph = ({ children }) => {
  return <p style={{ marginBottom: '8px' }}>{children}</p>
}

// 供应商和客户的表单(自行填写)
const AgentSupplyForm = (props) => {
  const { contextKey, title } = props
  const {
    form,
    [contextKey]: { config, list, push, remove, canAdd },
    edit: { initialValue }
  } = usePageContext()

  return (
    <React.Fragment>
      {list.map((s, i) => (
        <Dynamic
          key={s.companyName}
          title={`${title}${i + 1}`}
          length={list.length}
          deleteItem={() => remove((d) => d.companyName === s.companyName)}
        >
          {renderForm(enhanceConfig(config, s.companyName), { form, initialValue })}
        </Dynamic>
      ))}
      {canAdd && (
        <AddButton onClick={() => push({ companyName: Date.now() })}>添加{title}</AddButton>
      )}
    </React.Fragment>
  )
}

// 供应商和客户的表单(官方)
const AgentSupplyOtherForm = (props) => {
  const { contextKey, title } = props
  const {
    form,
    [contextKey]: { config, list },
    edit: { initialValue },
    otherForm: { otherFormInit }
  } = usePageContext()

  return (
    <React.Fragment>
      {list.map((s, i) => (
        <Dynamic key={s.companyName} title={`${title}${i + 1}`} length={list.length}>
          {renderForm(enhanceConfig(config, s.companyName), {
            form,
            initialValue: {
              ...initialValue,
              ...otherFormInit
            }
          })}
        </Dynamic>
      ))}
    </React.Fragment>
  )
}

// 汇总之后的表单
const RelationForm = (props) => {
  const {
    form,
    otherForm: { isSelf, toggle },
    supplyOtherForm: { list: supplyList },
    agentOtherForm: { list: agentList },
    edit: { data: savedData }
  } = usePageContext()

  const { getFieldDecorator, getFieldValue } = form

  const companyName = getFieldValue('companyBasicInfo.orgName')

  const renderExtra = () => {
    const { updateTimeOther } = savedData
    const hasData = supplyList.length || agentList.length

    if (!isSelf) {
      // （融资企业从未授权过）
      if (!updateTimeOther) {
        return (
          <React.Fragment>
            <Paragraph>暂无</Paragraph>
            <Paragraph>
              很抱歉您暂无获取权限，如需获取官方数据请联系融资企业进行相应授权操作，如仍需展示供销关系请选择自主上报方式
            </Paragraph>
          </React.Fragment>
        )
      } else {
        // 企业授权过了
        // 没数据
        if (!hasData) {
          return (
            <React.Fragment>
              <Paragraph>暂无</Paragraph>
              <Paragraph>获取日期：{updateTimeOther}</Paragraph>
              <Paragraph>
                数据来自企业已采集的进项、销项分析，如有疑议请联系企业通过泾渭助手采集最新数据并重新获取
              </Paragraph>
            </React.Fragment>
          )
        }
        // 有数据
        return (
          <Paragraph>
            <Icon style={{ marginRight: 8 }} type="info-circle" theme="twoTone" />
            {companyName}已于{updateTimeOther}执行授权获取供销关系操作
          </Paragraph>
        )
      }
    }

    return null
  }

  const handleRadioChange = (e) => {
    toggle(!e.target.value)
  }

  return (
    <Card title={<span id="供销关系">供销关系</span>}>
      <Form.Item {...formLayout} label="来源" extra={renderExtra()}>
        {getFieldDecorator('dataSource', {
          initialValue: 0
        })(
          <Radio.Group onChange={handleRadioChange}>
            <Radio value={0}>手动填报</Radio>
            <Radio value={1}>授权导入</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <div style={{ display: isSelf ? 'block' : 'none' }}>
        <AgentSupplyForm title="供应商" contextKey="supplyForm" />
        <AgentSupplyForm title="客户" contextKey="agentForm" />
      </div>
      <div style={{ display: isSelf ? 'none' : 'block' }}>
        <AgentSupplyOtherForm title="供应商" contextKey="supplyOtherForm" />
        <AgentSupplyOtherForm title="客户" contextKey="agentOtherForm" />
      </div>
    </Card>
  )
}

export default RelationForm
