import React, { useCallback, useState, useEffect } from 'react'
import { Input, Modal, Tabs, Card, Row, Col, Icon } from 'antd'
import { useBoolean } from '@dragon/hooks'
import styles from './styles.less'

import IconData from './IconData'

const { Search } = Input

// onChange是antd Form getFieldDecorator自带的属性
const SelectMenu = React.forwardRef(({ value = 'setting', onChange }, ref) => {
  const [innerValue, setInnerValue] = useState(value)

  const { state: visible, setTrue: show, setFalse: close } = useBoolean()

  const handleChange = useCallback((e) => {
    setInnerValue(e.target.value)
  }, [])

  useEffect(() => {
    onChange(innerValue)
  }, [innerValue, onChange])

  const renderModal = useCallback(() => {
    const handleIconClick = (icon) => {
      onChange(icon)
      close()
    }

    return (
      <Modal width={900} visible={visible} onCancel={close} footer={null}>
        <Tabs defaultActiveKey="direction">
          {IconData.map((data) => (
            <Tabs.TabPane tab={data.description} key={data.category}>
              <Card bordered={false}>
                <Row gutter={24} className={styles.iconPreview}>
                  {data.icons.map((icon) => (
                    <Col span={4} key={icon}>
                      <Icon type={icon} onClick={() => handleIconClick(icon)} />
                    </Col>
                  ))}
                </Row>
              </Card>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Modal>
    )
  }, [close, onChange, visible])

  return (
    <React.Fragment>
      <Search
        ref={ref}
        value={innerValue}
        onChange={handleChange}
        prefix={<Icon type={value} />}
        placeholder="请选择菜单图标"
        onSearch={show}
        enterButton
      />
      {renderModal()}
    </React.Fragment>
  )
})

export default SelectMenu
