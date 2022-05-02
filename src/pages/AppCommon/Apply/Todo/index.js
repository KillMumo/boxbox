import React from 'react'
import Card from '@/components/Card'
import Panel from './components/Panel'
import { useRequest } from '@dragon/hooks'
import { fetchTodoList } from '@/services/apply'

const Todo = () => {
  const { data: map = {}, loading } = useRequest(fetchTodoList, {
    enhanceResponse: (res) => {
      return res.reduce((map, item) => {
        if (map[item.flowType]) {
          map[item.flowType] = map[item.flowType].concat([item])
        } else {
          // 新增
          map[item.flowType] = [item]
        }
        return map
      }, {})
    }
  })

  return (
    <Card loading={loading}>
      {Object.keys(map).map((p) => {
        const items = map[p]
        return (
          <Panel key={p} title={p}>
            {items.map((i) => {
              return <Panel.Item key={i.id} item={i} />
            })}
          </Panel>
        )
      })}
      {/* <Panel title="金票流程">
        <Panel.Item to="/bill/issue/apply/step1" type="android" desc="申请开单" />
        <Panel.Item to="/bill/confirm" type="plus-circle" desc="开票确权" />
        <Panel.Item to="/bill/trial" type="apple" desc="开票初审" />
        <Panel.Item to="/bill/retrial" type="windows" desc="开票复审" />
        <Panel.Item to="/bill/sign" type="ie" desc="开票签收" />
        <Panel.Item to="/bill/transfer" type="chrome" desc="签收转让" />
        <Panel.Item to="/bill/finance" type="chrome" desc="申请融资" />
        <Panel.Item to="/bill/childCollection" type="github" desc="子单托收" />
        <Panel.Item to="/bill/originCollection" type="google" desc="原单托收" />
      </Panel>
      <Panel title="其他流程">
        <Panel.Item desc="申请1" />
        <Panel.Item desc="申请2" />
        <Panel.Item desc="申请3" />
      </Panel> */}
    </Card>
  )
}

export default Todo
