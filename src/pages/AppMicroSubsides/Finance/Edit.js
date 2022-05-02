import React, { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { Form, Button, message } from 'antd'
import Anchor from '@/components/Anchor'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest, useArray } from '@dragon/hooks'
import { saveFinance, fetchDetail } from '@/services/microSubsidy/finance'
import router from 'umi/router'
import { renderForm } from '@/utils/Form'
// import useFinanceConfig from './hooks/useFinanceConfig'
// import useGuaranteeConfig from './hooks/useGuaranteeConfig'
import { isComplete } from '@/services/microSubsidy/finance'
import PageLoading from '@/components/Loading/PageLoading'
import { useFinanceConfig, useGuaranteeConfig, useOtherConfig } from './hooks/useFormConfig'
// import Dynamic from './components/Dynamic'
import AddButton from './components/AddButton'
import OrgAssets from './components/OrgAssets'
import PersonAssets from './components/PersonAssets'

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
    form: { validateFieldsAndScroll },
    match: {
      params: { id }
    },
    location: {
      query: { orgName }
    }
  } = props

  const [decoded, setDecoded] = useState({})

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

  // 编辑页企业完善度请求
  const { start: fetchCompanyDetailReq } = useRequest(isComplete, {
    manual: true
  })

  // 编辑页请求详情
  const { data: saveDetail = {}, loading: fetching, start: getDetailReq } = useRequest(
    fetchDetail,
    {
      manual: true,
      onSuccess: (res) => {
        fetchCompanyDetailReq({ orgName: res.extra.orgName })
        setOrgAssets(res.extra.orgAssets || [])
        setPersonAssets(res.extra.personAssets || [])
        setDecoded(decode(res.extra))
      }
    }
  )

  // 融资信息
  const { detail, financeConfig } = useFinanceConfig(props.form, saveDetail, orgName)

  // 其他融资信息
  const otherConfig = useOtherConfig(props.form, saveDetail)

  useEffect(() => {
    if (id) {
      getDetailReq({ bizNo: id })
    }
  }, [getDetailReq, id])

  // 暂存的方法
  const { loading: saveLoading, start: saveFinanceReq } = useRequest(saveFinance, {
    manual: true,
    onSuccess: (res) => {
      message.success('保存成功')
      router.push(`/msFinance/view/${id}`)
    }
  })

  // 暂存
  const handleSave = (e) => {
    e.preventDefault()
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = encode(values)
        saveFinanceReq({
          // 数据encode
          orgLoanInfo: [],
          personLoanInfo: [],
          // ...saveDetail.extra,
          bizNo: id,
          ...detail,
          ...params
        })
      }
    })
  }

  if (!saveDetail.extra && id) {
    return <PageLoading />
  }

  return (
    <Card loading={fetching} transparent>
      <Anchor anchorList={anchorList} />
      <Form {...formLayout}>
        <Card title={<span id="financeInfo">担保信息</span>}>
          {/* {renderForm(financeConfig, {
            form: props.form,
            initialValue: { ...saveDetail.extra, ...props.location.query, ...decoded }
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
            <Button loading={saveLoading} onClick={handleSave}>
              保存
            </Button>
          </ButtonGroup>
        </Card>
      </Form>
    </Card>
  )
}

export default Form.create()(Apply)
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
