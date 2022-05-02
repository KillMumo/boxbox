import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Button, message, Modal } from 'antd'
import Anchor from '@/components/Anchor'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest, useArray } from '@dragon/hooks'
import {
  startFinance,
  saveFinance,
  fetchDetail,
  isComplete
} from '@/services/microSubsidy/companyFinance'
import router from 'umi/router'
import { renderForm } from '@/utils/Form'
// import useFinanceConfig from './hooks/useFinanceConfig'
// import useGuaranteeConfig from './hooks/useGuaranteeConfig'
import { useSelector } from 'react-redux'
import PageLoading from '@/components/Loading/PageLoading'
import { useFinanceConfig, useGuaranteeConfig, useOtherConfig } from './hooks/useFormConfig'
// import Dynamic from './components/Dynamic'
import AddButton from './components/AddButton'
import OrgAssets from './components/OrgAssets'
import PersonAssets from './components/PersonAssets'
import { isObjectNull } from '@/utils'
import { Prompt } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

const formLayout = {
  labelAlign: 'left',
  colon: false,
  labelCol: { span: 4 },
  wrapperCol: { span: 7 }
}

const anchorList = [
  { key: 'financeInfo', tab: '担保申请信息' },
  { key: 'counterGuaranteeInfo', tab: '反担保信息' }
]

const Apply = (props) => {
  const {
    form: { validateFieldsAndScroll, getFieldsValue },
    match: {
      params: { id }
    }
  } = props

  // 获取redux里当前用户的企业信息
  const orgName = useSelector(({ user }) => user.user.orgName)

  //解析返回的数据
  const [decoded, setDecoded] = useState({})

  // 控制弹框的关闭
  const [visible, setVisible] = useState(false)

  // 企业资产信息列表
  const [orgAssets, { remove: deleteOrgAssets, push: addOrgAssets, set: setOrgAssets }] = useArray(
    []
  )

  // 个人资产信息列表
  const [
    personAssets,
    { remove: deletePersonAssets, push: addPersonAssets, set: setPersonAssets }
  ] = useArray([])

  // 反担保信息
  const guaranteeConfig = useGuaranteeConfig(props.form)

  // 编辑页请求详情
  const { data: saveDetail = {}, loading: fetching, start: getDetailReq } = useRequest(
    fetchDetail,
    {
      manual: true,
      onSuccess: (res) => {
        setOrgAssets(res.extra.orgAssets || [])
        setPersonAssets(res.extra.personAssets || [])
        setDecoded(decode(res.extra))
      }
    }
  )

  // 请求企业信息-完善度-是否必填
  const { data: companyDetail = {}, start: fetchCompanyDetailReq } = useRequest(isComplete, {
    manual: true,
    onSuccess: () => {
      setVisible(true)
    }
  })

  // 融资信息
  const financeConfig = useFinanceConfig(props.form, companyDetail, saveDetail)

  // 其他融资信息
  const otherConfig = useOtherConfig(props.form, saveDetail)

  useEffect(() => {
    if (id) {
      getDetailReq({ bizNo: id })
    }
    fetchCompanyDetailReq({ orgName: orgName })
    const listener = (e) => {
      e.preventDefault()
      e.returnValue = '未保存'
    }
    window.addEventListener('beforeunload', listener)
    return () => {
      window.removeEventListener('beforeunload', listener)
    }
  }, [getDetailReq, id, orgName, fetchCompanyDetailReq])

  // 发起的方法
  const { loading: submitLoading, start: startFinanceReq } = useRequest(startFinance, {
    manual: true,
    onSuccess: (res) => {
      message.success('提交成功')
      router.push('/msCompanyFinance/list')
    }
  })

  // 暂存的方法
  const { loading: saveLoading, start: saveFinanceReq } = useRequest(saveFinance, {
    manual: true,
    onSuccess: (res) => {
      message.success('保存成功')
      router.push('/msCompanyFinance/list')
    }
  })

  // 提交
  const handleSubmit = (e) => {
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = encode(values)
        startFinanceReq({
          // 申请融资时间
          applyDate: Date.now(),
          // ...saveDetail.extra,
          orgLoanInfo: [],
          personLoanInfo: [],
          bizNo: id,
          ...companyDetail,
          ...params
        })
      }
    })
  }

  // 暂存
  const handleSave = () => {
    const values = getFieldsValue()
    const params = encode(values)
    saveFinanceReq({
      // ...saveDetail.extra,
      orgLoanInfo: [],
      personLoanInfo: [],
      bizNo: id,
      ...companyDetail,
      ...params
    })
  }

  const renderTips = () => {
    //先取到接口的返回值再做判断
    if (Object.keys(companyDetail).length) {
      //如果必填项为true，展示完善度
      if (companyDetail.isComplete) {
        return (
          <Card style={{ marginTop: 24 + 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', marginRight: 5 }}>
                  您的企业信息完善分为
                </span>
                <span style={{ fontSize: 20, color: 'rgba(25, 137, 170, 1)', marginLeft: 2 }}>
                  {companyDetail.infoPerfection}
                </span>
                <br />
                <span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.65)' }}>
                  完善分不足，可能会影响融资担保审核进度和结果
                </span>
              </div>
              <div>
                <ButtonGroup>
                  <Button
                    type="primary"
                    to={`/msUserCenter/companyInfo/edit/${companyDetail.orgId}`}
                    disabled={companyDetail.isLockEdit}
                  >
                    前去完善
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </Card>
        )
      }
      //如果必填项为false，展示弹框
      else {
        return (
          <Modal
            title="温馨提示"
            visible={visible && !companyDetail?.isComplete}
            onOk={() => {
              router.push(`/msUserCenter/companyInfo/edit/${companyDetail.orgId}`)
            }}
            onCancel={() => {
              setVisible(false)
            }}
            okText="前往完善"
            cancelText="跳过"
          >
            <p>您的企业信息中有必填项未填写，无法申请融资担保，请立刻前往完善。</p>
          </Modal>
        )
      }
    }
  }

  const getConfirmation = (message, callback) => {
    // 至关重要的callback方法，可以异步执行
    // if (!window.pageChangeConfirm) { // G.pageChangeConfirm为页面内的全局变量，用于数据交互与条件判断
    //     callback(true);
    //     return;
    // }
    Modal.confirm({
      title: '离开该页面，表单信息将不被保留？是否确定离开该页面？',
      content: '',
      okText: '离开',
      cancelText: '取消',
      onOk() {
        callback(true)
      },
      onCancel() {
        callback(false)
      }
    })
  }

  if (!saveDetail.extra && id) {
    return <PageLoading />
  }

  return (
    <BrowserRouter getUserConfirmation={getConfirmation}>
      <Prompt message="确定要离开？" when={true} />
      <Card loading={fetching} transparent>
        <Anchor anchorList={anchorList} targetOffset={350} />
        {renderTips()}
        <Form {...formLayout} onSubmit={handleSubmit}>
          <Card title={<span id="financeInfo">担保信息</span>}>
            {/* {renderForm(financeConfig, {
            form: props.form,
            initialValue: { ...saveDetail.extra, ...decoded }
          })} */}
            {/* 融资信息 */}
            {renderForm(financeConfig, {
              form: props.form,
              initialValue: { ...saveDetail.extra, ...props.location.query, ...decoded }
            })}
            {/* 企业资产信息 */}
            {orgAssets.length !== 0 && (
              <Form.Item
                label={orgAssets.length !== 0 ? '企业资产' : ''}
                // wrapperCol={testList.length === 0 ? { span: 14 } : { span: 14, offset: 4 }}
              ></Form.Item>
            )}
            {orgAssets.map((s, i) => (
              <OrgAssets
                key={s.id}
                form={props.form}
                id={s.id}
                initialValue={{ [`${s.id}/orgAssets.isMortgaged`]: '是', ...decoded }}
                title={`企业资产${i + 1}`}
                length={orgAssets.length}
                deleteItem={() => deleteOrgAssets((d) => d.id === s.id)}
              />
            ))}
            {orgAssets.length <= 10 && (
              <Form.Item
                label={orgAssets.length === 0 ? '企业资产' : ''}
                wrapperCol={orgAssets.length === 0 ? { span: 14 } : { span: 14, offset: 4 }}
              >
                <AddButton onClick={() => addOrgAssets({ id: Date.now() })}>添加一笔资产</AddButton>
              </Form.Item>
            )}
            {/* 个人资产信息 */}
            {personAssets.length !== 0 && (
              <Form.Item
                label={personAssets.length !== 0 ? '个人资产' : ''}
                // wrapperCol={testList.length === 0 ? { span: 14 } : { span: 14, offset: 4 }}
              ></Form.Item>
            )}
            {personAssets.map((s, i) => (
              <PersonAssets
                key={s.id}
                form={props.form}
                id={s.id}
                initialValue={{ [`${s.id}/personAssets.isMortgaged`]: '是', ...decoded }}
                title={`个人资产${i + 1}`}
                length={personAssets.length}
                deleteItem={() => deletePersonAssets((d) => d.id === s.id)}
              />
            ))}
            {personAssets.length <= 10 && (
              <Form.Item
                label={personAssets.length === 0 ? '个人资产' : ''}
                wrapperCol={personAssets.length === 0 ? { span: 14 } : { span: 14, offset: 4 }}
              >
                <AddButton onClick={() => addPersonAssets({ id: Date.now() })}>
                  添加一笔资产
                </AddButton>
              </Form.Item>
            )}
            {/* 借款情况&&其他融资信息 */}
            {renderForm(otherConfig, {
              form: props.form,
              initialValue: { ...saveDetail.extra, ...props.location.query, ...decoded }
            })}
          </Card>
          <Card title={<span id="counterGuaranteeInfo">反担保信息</span>}>
            {renderForm(guaranteeConfig, { form: props.form, initialValue: saveDetail.extra })}
            <ButtonGroup fixed align="center">
              <Button
                loading={saveLoading}
                onClick={handleSave}
                disabled={isObjectNull(props.form.getFieldsValue())}
              >
                保存
              </Button>
              <Button
                loading={submitLoading}
                type="primary"
                htmlType="submit"
                disabled={!companyDetail.isComplete}
              >
                提交
              </Button>
            </ButtonGroup>
          </Card>
        </Form>
      </Card>
    </BrowserRouter>
  )
}

export default Form.create()(Apply)

// 解析数据
// function decode(obj) {
//   const res = {}
//   Object.keys(obj).forEach((key) => {
//     const item = obj[key]
//     if (key === 'loanRecordFiles') {
//       item.forEach((v, i) => {
//         res[`${i}/loanRecordFiles`] = v
//       })
//     } else {
//       res[key] = item
//     }
//   })
//   return res
// }

// 解析数据
function decode(obj) {
  let res = {}
  Object.keys(obj).forEach((fatherKey) => {
    if (obj[fatherKey]) {
      if (Array.isArray(obj[fatherKey])) {
        if (fatherKey === 'orgLoanInfo') {
          obj[fatherKey].forEach((v, i) => {
            res[`${i}/orgLoanInfo`] = v
          })
        } else if (fatherKey === 'personLoanInfo') {
          obj[fatherKey].forEach((v, i) => {
            res[`${i}/personLoanInfo`] = v
          })
        } else {
          obj[fatherKey].forEach((item, index) => {
            Object.keys(item).forEach((childKey) => {
              res[`${item.id}/${fatherKey}.${childKey}`] = item[childKey] || void 0
            })
          })
        }
      } else {
        Object.keys(obj[fatherKey]).forEach((childKey) => {
          // res[`${fatherKey}.${childKey}`] =
          //   typeof obj[fatherKey][childKey] === 'number'
          //     ? obj[fatherKey][childKey]
          //     : obj[fatherKey][childKey] || void 0
        })
      }
    }
  })

  return res
}

function encode(values) {
  Object.keys(values).forEach((key) => {
    if (key.includes('/')) {
      const arrayName = key.split('/')[1]
      if (values[arrayName]) {
        values[key] && values[arrayName].push(values[key])
      } else {
        values[key] && (values[arrayName] = [values[key]])
      }
      delete values[key]
    }
  })

  return values
}

// 数据变成后端需要的样子
// function encode(obj) {
//   const res = {}
//   Object.keys(obj).forEach((key) => {
//     if (key.includes('/')) {
//       const realKey = key.split('/')[1]
//       if (res[realKey]) {
//         obj[key] && res[realKey].push(obj[key])
//       } else {
//         obj[key] && (res[realKey] = [obj[key]])
//       }
//     } else {
//       res[key] = obj[key]
//     }
//   })

//   return res
// }
