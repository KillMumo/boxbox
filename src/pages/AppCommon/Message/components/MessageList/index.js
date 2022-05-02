import React from 'react'
import moment from 'moment'
import { Collapse, Badge } from 'antd'
import styles from './styles.less'

const Panel = Collapse.Panel

const oddStyle = {
  background: '#fff',
  border: 0
}
const evenStyle = {
  background: '#F9FBFD',
  border: 0
}
/*const oddDivStyle = {
  background: '#fff',
  height: '46px'
};
const evenDivStyle = {
  background: '#F9FBFD',
  height: '46px'
};*/

const MessageList = (props) => {
  //data：消息数据；
  const { data, msgCode, callback } = props

  /*const length = data.length;
  const blankLen = 10 - length;
  const blankItems = [];
  for (let i = 0; i < blankLen; i += 1) {
    blankItems.push(length + i);
  }*/

  return (
    <React.Fragment>
      <Collapse
        bordered={false}
        onChange={callback}
        //手风琴模式
        accordion
        //当前激活 tab 面板的 key
        activeKey={msgCode}
      >
        {data.map((item, index) => {
          return (
            <Panel
              style={index % 2 === 0 ? evenStyle : oddStyle}
              header={
                <div className={styles.messageDiv}>
                  <Badge status={item.status === '0' ? 'error' : 'default'} />
                  <span>{item.messageTitle}</span>
                  <span className={styles.time}>
                    <span className={styles.date}>
                      {moment(item.sendDate).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </span>
                </div>
              }
              key={item.messageRecCode}
              showArrow={false}
            >
              {<p className={styles.content}>{item.messageContent}</p>}
            </Panel>
          )
        })}
        {/*{
          blankItems.map((item) => {
            return (
              <React.Fragment key={item}>
                <div
                  style={item % 2 === 0 ? evenDivStyle : oddDivStyle}
                />
              </React.Fragment>
            );
          })
        }*/}
      </Collapse>
    </React.Fragment>
  )
}

export default MessageList
