import React, { useState, useCallback, useMemo } from 'react'
import Card from '@/components/Card'
import MessageList from './components/MessageList'
import TableFooter from '@/components/PagingTable/TableFooter'
import styles from './styles.less'

const emptyImg = require('@/assets/noMessage.png')
//tab列表
const tabList = [
  {
    key: '0',
    tab: '系统消息'
  }
]
//列表数据
const data = [
  {
    billCode: 'BI20190515133412756784491',
    businessNo: null,
    messageCode: 'ME20200226010032604864312',
    messageContent:
      '亲爱的用户：保理商开具给贵司的金票流转单BI20190515133412756784491已进入异常状态，金额150.00元，到期日2019年05月24日，系统已启动异常流程。',
    messageRecCode: 'ME20200226010032631822355',
    messageTitle: '金票子单异常通知',
    sendDate: 1582650032604,
    status: '0'
  },
  {
    billCode: 'BI20191122144201535693843',
    businessNo: null,
    messageCode: 'ME20200226010043956789322',
    messageContent:
      '亲爱的用户：保理商开具给贵司的金票流转单BI20191122144201535693843已进入异常状态，金额5.00元，到期日2019年11月22日，系统已启动异常流程。',
    messageRecCode: 'ME20200226010043990187765',
    messageTitle: '金票子单异常通知',
    sendDate: 1582650043956,
    status: '1'
  }
]

const List = () => {
  //用dva存取数据
  // const { dispatch } = props
  // 选中的tabKey
  const [key, setKey] = useState('0')
  //tab切换
  const handleTabChange = useCallback((key) => {
    setKey(key)
  }, [])
  //当前激活(即展开)的tab面板的 key
  const [msgCode, setMsgCode] = useState('0')

  //Footer参数
  const [current, setCurrent] = useState(1) // pageNo
  const [size, setSize] = useState(10) // pageSize
  const [total] = useState(2) // 总量

  // 请求接口的方法

  /*const { loading, data: data = [], start: getMessageListReq } = useRequest(
      () => getMessageList(current, size),
      [],
      {
        enhanceResponse: res => {
          setTotal(res.total)
          return res.records
        }
      },
    )*/
  //Footer的setting
  const setting = useMemo(() => {
    const onPaginationChange = (newPageNum, newPageSize) => {
      setSize(newPageSize)
      setCurrent(newPageNum)
      //getMessageListReq(current,size)
    }

    return {
      total,
      onPaginationChange,
      current,
      size
    }
  }, [current, size, total])

  //消息列表为空的页面
  const getEmptyContent = () => {
    return (
      <div className={styles.emptyWrapper}>
        <img src={emptyImg} alt="" />
        <p>暂无消息通知</p>
      </div>
    )
  }

  //渲染消息列表
  const renderMessageList = useCallback(() => {
    //标记消息已读
    const changeReadStatus = (params) => {
      //调用service的改变消息已读状态函数
      /*readStatus(params).then((res) => {
        if (res instanceof Error) return
        //重新获取数据
        // getMessageListReq(current,size)
        // 调用全局方法，实现点击消息列表的页面，刷新铃铛上面的数字和消息列表
        dispatch({type: 'GET_MESG_REQUESTED'})
        dispatch({type: 'GET_MESGQUATITY_REQUESTED'})
      })*/
      console.log('测试标记消息已读函数')
    }

    //点击展开消息的回调事件
    const callbackMessage = (key) => {
      //标记消息已读
      changeReadStatus(key)
      //set当前激活 tab 面板的 key
      setMsgCode(key)
    }

    return total === 0 ? (
      getEmptyContent()
    ) : (
      <React.Fragment>
        <MessageList data={data} msgCode={msgCode} callback={callbackMessage} />
        <TableFooter setting={setting} />
      </React.Fragment>
    )
  }, [msgCode, setting, total])

  //tab渲染列表
  const tabs = useMemo(
    () => ({
      '0': () => renderMessageList()
    }),
    [renderMessageList]
  )

  return (
    <Card tabList={tabList} onTabChange={handleTabChange} defaultActiveTabKey="0">
      {tabs[key]()}
    </Card>
  )
}

export default List
