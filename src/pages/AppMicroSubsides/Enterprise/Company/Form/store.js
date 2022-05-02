import cpc from '@dragon/page-context'
import useFormArray from './hooks/useFormArray'
import {
  useBasicConfig,
  useBankConfig,
  useRelationOtherConfig,
  useFamilyConfig,
  useAdminConfig,
  useRelationSelfConfig
} from './form.config'
import useApply from './hooks/useApply'
import useEdit from './hooks/useEdit'
import useOtherForm from './hooks/useOtherForm'
import { useCallback } from 'react'
import { useBool } from '@dragon/hooks'

// page-context 汇总的hook
const useIndex = (props) => {
  // id是编辑时的id
  const { id, form } = props

  // 自行填写还是官方授权
  const [isSelf, { toggle }] = useBool(true)

  // -----------------表单配置---------------------
  // 基本户配置
  const bankConfig = useBankConfig(form)
  // utils对象包含了 push remove 和canAdd
  // 一般户列表
  const [normalList, normalUtils] = useFormArray([], 5)
  // 供应商配置（自主）
  const supplyConfig = useRelationSelfConfig(form, 'supplierSelf')
  const [supplyList, supplyUtils] = useFormArray([], 10)
  // 客户配置（自主）
  const agentConfig = useRelationSelfConfig(form, 'clientSelf')
  const [agentList, agentUtils] = useFormArray([], 10)
  // 供应商配置（官方）
  const supplyOtherConfig = useRelationOtherConfig(form, 'supplierOther')
  const [supplyOtherList, supplyOtherUtils] = useFormArray([], 10)
  // 客户配置（官方）
  const agentOtherConfig = useRelationOtherConfig(form, 'clientOther')
  const [agentOtherList, agentOtherUtils] = useFormArray([], 10)
  // 父母配置
  const parentConfig = useFamilyConfig(form, 'parent')
  const [parentList, parentUtils] = useFormArray([], 5)
  // 配偶配置
  const mateConfig = useFamilyConfig(form, 'mate')
  const [mateList, mateUtils] = useFormArray([], 2)
  // 子女配置
  const childConfig = useFamilyConfig(form, 'children')
  const [childList, childUtils] = useFormArray([], 5)
  // -----------------表单配置---------------------

  // ------------------编辑的信息--------------
  const setList = useCallback(
    (res) => {
      normalUtils.set(res.generalAccount || [])
      supplyUtils.set(res.supplierSelf || [])
      supplyOtherUtils.set(res.supplierOther || [])
      agentUtils.set(res.clientSelf || [])
      agentOtherUtils.set(res.clientOther || [])
      parentUtils.set(res.parent || [])
      mateUtils.set(res.mate || [])
      childUtils.set(res.children || [])
    },
    [
      agentOtherUtils,
      agentUtils,
      childUtils,
      mateUtils,
      normalUtils,
      parentUtils,
      supplyOtherUtils,
      supplyUtils
    ]
  )
  const edit = useEdit({ id, setList, form, toggle })
  // ------------------编辑的信息--------------

  // 基本信息配置
  const basicConfig = useBasicConfig(form, edit.initialValue, {})
  // 管理员配置
  const adminConfig = useAdminConfig(props.form, edit.initialValue)

  const otherForm = useOtherForm({
    isSelf,
    toggle,
    supplyOtherUtils,
    agentOtherUtils
  })

  return {
    form,
    basicForm: { basicConfig }, // 企业信息表单
    bankForm: { bankConfig }, // 基本户表单
    normalForm: { normalList, ...normalUtils }, // 一般户表单
    supplyForm: { config: supplyConfig, list: supplyList, ...supplyUtils }, // 供应商配置
    agentForm: { config: agentConfig, list: agentList, ...agentUtils }, // 客户配置
    supplyOtherForm: { config: supplyOtherConfig, list: supplyOtherList, ...supplyOtherUtils }, // 供应商官方
    agentOtherForm: { config: agentOtherConfig, list: agentOtherList, ...agentOtherUtils }, // 客户官方
    parentForm: { config: parentConfig, list: parentList, ...parentUtils }, // 父母配置
    mateForm: { config: mateConfig, list: mateList, ...mateUtils }, // 配偶配置
    childForm: { config: childConfig, list: childList, ...childUtils }, // 子女配置
    adminForm: { adminConfig },
    // 与添加企业（提交）相关的的数据
    apply: useApply(form),
    // 与编（辑企）业信息相关的数据
    edit,
    // 官方授权的form的effects
    otherForm
  }
}

const [withProvider, usePageContext] = cpc(useIndex)

export { withProvider, usePageContext }

export function enhanceConfig(config, id) {
  return config.map((c) => {
    if (Array.isArray(c.children)) {
      return {
        ...c,
        children: enhanceConfig(c.children, id)
      }
    }
    return {
      ...c,
      name: `${id}/${c.name}`
    }
  })
}

export function formatValues(values) {
  Object.keys(values).forEach((key) => {
    if (key.includes('/')) {
      const arrayName = key.split('/')[1]
      if (values[arrayName]) {
        values[arrayName].push(values[key])
      } else {
        values[arrayName] = [values[key]]
      }
      delete values[key]
    }
  })

  return values
}

export // 解析数据
function decode(obj) {
  let res = {}
  Object.keys(obj).forEach((fatherKey) => {
    if (obj[fatherKey]) {
      if (Array.isArray(obj[fatherKey])) {
        obj[fatherKey].forEach((item, index) => {
          Object.keys(item).forEach((childKey) => {
            res[`${item.name || item.companyName || item.bankNumber}/${fatherKey}.${childKey}`] =
              typeof item[childKey] === 'number' ? item[childKey] : item[childKey] || void 0
          })
        })
      } else {
        Object.keys(obj[fatherKey]).forEach((childKey) => {
          res[`${fatherKey}.${childKey}`] =
            typeof obj[fatherKey][childKey] === 'number'
              ? obj[fatherKey][childKey]
              : obj[fatherKey][childKey] || void 0
        })
      }
    }
  })

  return res
}
