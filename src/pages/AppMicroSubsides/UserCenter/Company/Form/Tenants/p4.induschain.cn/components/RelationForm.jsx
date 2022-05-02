import React, { useCallback } from 'react'
import { usePageContext, enhanceConfig } from '../store'
import { renderForm } from '@/utils/Form'
import Dynamic from './Dynamic'
import AddButton from './AddButton'
import Card from '@/components/Card'
import { Form, Radio, Popover, Icon } from 'antd'
import Link from 'umi/link'

const Paragraph = ({ children }) => {
  return <p style={{ marginBottom: '8px' }}>{children}</p>
}

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
  colon: false
}

// popover 弹框
const Pop = (
  <Popover
    content={
      <div style={{ maxWidth: 200 }}>
        重新获取前请确保已通过泾渭助手于安装有开票软件且插上税盘的电脑完成全部最新销项数据采集
      </div>
    }
  >
    <Icon style={{ marginLeft: 8 }} type="question-circle" />
  </Popover>
)

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
    supplyOtherForm: { list: supplyList },
    agentOtherForm: { list: agentList },
    otherForm: { isSelf, toggle, loading, fetch, data },
    edit: { data: savedData }
  } = usePageContext()

  const { getFieldDecorator, getFieldValue } = form

  // 企业名称
  const companyName = getFieldValue('companyBasicInfo.orgName')
  // 社会统一信用代码
  const socialCreditCode = getFieldValue('companyBasicInfo.socialCreditCode')

  const fetchData = useCallback(() => fetch({ orgName: companyName, socialCreditCode }), [
    companyName,
    fetch,
    socialCreditCode
  ])

  const renderExtra = () => {
    const hasData = supplyList.length || agentList.length

    const { type, updateTimeOther } = data || savedData
    if (!isSelf) {
      if ([0, 2, null].includes(type)) {
        return (
          <React.Fragment>
            <Paragraph>
              您好，请您
              <Link to="/download" target="_blank">
                点击此处下载
              </Link>
              授权插件并按步骤进行数据授权与采集操作，授权对象为：杭州产链数字科技有限公司
            </Paragraph>
            <Paragraph>
              已成功授权并采集？请<a onClick={fetchData}>点击此处</a>
              自动导入数据
            </Paragraph>
          </React.Fragment>
        )
      }

      if (!hasData) {
        return (
          <React.Fragment>
            <Paragraph>暂无</Paragraph>
            <Paragraph>
              数据来自企业已采集的进项、销项分析，如有疑议请通过泾渭助手采集最新数据并
              <a onClick={fetchData}>重新获取</a>
              {Pop}
            </Paragraph>
          </React.Fragment>
        )
      }

      return (
        <React.Fragment>
          <div style={{ display: 'inline-block' }}>
            <Icon style={{ marginRight: 8 }} type="info-circle" theme="twoTone" />
            您当前数据采集时间为{updateTimeOther}
            <a style={{ marginLeft: 16 }} onClick={fetchData}>
              重新获取
            </a>
          </div>
          {Pop}
        </React.Fragment>
      )
    }
    return null
  }

  const handleRadioChange = (e) => {
    toggle(!e.target.value)
  }

  return (
    <Card title={<span id="供销关系">供销关系</span>} loading={loading}>
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
