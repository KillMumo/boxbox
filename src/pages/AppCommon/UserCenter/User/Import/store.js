import cpc from '@dragon/page-context'
import { useNumber, usePersistFn } from '@dragon/hooks'
import { useCallback, useState } from 'react'

const useValue = (props) => {
  const { form } = props

  // 当前步骤
  const [current, { increment, decrement }] = useNumber(1)

  // 选中的行的key
  const [selectRows, setSelectRows] = useState([])
  // 第一步选中的行
  const [selectRecords1, setSelectRecords1] = useState({})
  // 第二步选中的行
  const [selectRecords2, setSelectRecords2] = useState({})

  // 上一步
  const onPrevious = usePersistFn((value) => {
    decrement()
  })

  // 下一步
  const next = useCallback(() => {
    // 如果第二步的数组为空，则把第一步选中的赋值给第二步
    if (Object.keys(selectRecords2).length === 0) {
      setSelectRecords2(selectRecords1)
    }
    // 否则，比较第二步和第一步的数组
    else {
      let arr = []
      for (let i in selectRecords1?.records) {
        if (selectRecords1?.records[i]?.userId?.toString() === selectRecords2?.records[i]?.userId) {
          arr.push(selectRecords2?.records[i])
        } else arr.push(selectRecords1?.records[i])
      }
      setSelectRecords2({ records: arr })
    }
    increment()
  }, [increment, selectRecords1, selectRecords2])

  return {
    form,
    // 步骤的信息
    step: { current, next, onPrevious },
    // 表格选择的信息
    select: {
      selectRows,
      setSelectRows,
      selectRecords1,
      setSelectRecords1,
      selectRecords2,
      setSelectRecords2
    }
  }
}

const [withProvider, usePageContext] = cpc(useValue)

export { withProvider, usePageContext }
