import React, { Component } from 'react'
import { Menu, Anchor } from 'antd'
import { scrollToAnchor } from '@/utils'
import styles from '../styles.less'

class GlobalMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: '0',
      // 控制产品方案菜单抽屉
      visible: false
    }
  }

  scroll = (id) => {
    scrollToAnchor(id)
    this.setState({
      visible: false
    })
  }

  getMenu = () => {
    return (
      <div id="menu" style={{ height: 48, width: '100%' }}>
        <Anchor>
          <div style={{ height: 48 }}>
            <Menu
              className="reportMenu"
              selectedKeys={[this.state.current]}
              mode="horizontal"
              onClick={this.handleClick}
            >
              <Menu.Item
                key="0"
                onMouseOver={() => this.showDrawer('0')}
                onMouseOut={this.closeDrawer}
              >
                企业信息
              </Menu.Item>
              <Menu.Item
                key="1"
                onMouseOver={() => this.showDrawer('1')}
                onMouseOut={this.closeDrawer}
              >
                经营信息
              </Menu.Item>
              <Menu.Item
                key="2"
                onMouseOver={() => this.showDrawer('2')}
                onMouseOut={this.closeDrawer}
              >
                资产信息
              </Menu.Item>
              <Menu.Item
                key="3"
                onMouseOver={() => this.showDrawer('3')}
                onMouseOut={this.closeDrawer}
              >
                信用状况
              </Menu.Item>
              <Menu.Item
                key="4"
                onMouseOver={() => this.showDrawer('4')}
                onMouseOut={this.closeDrawer}
              >
                反担保信息
              </Menu.Item>
              <Menu.Item
                key="5"
                onMouseOver={() => this.showDrawer('5')}
                onMouseOut={this.closeDrawer}
              >
                法人/实控人及其关联人信息
              </Menu.Item>
            </Menu>
          </div>
          {this.state.visible && this.renderSubMenu()}
        </Anchor>
      </div>
    )
  }

  // 渲染子菜单
  renderSubMenu = () => {
    const { menuMap } = this.props
    const { current } = this.state
    return (
      <div
        className={this.state.visible ? `${styles.submenu} ${styles.active}` : styles.submenu}
        onMouseOver={() => this.showDrawer(current)}
        onMouseOut={this.closeDrawer}
      >
        {menuMap[current].children.map((i) => {
          return (
            <div className={styles.menuWrap}>
              <div className={styles.secondTitle}>{i.name}</div>
              {i.children &&
                i.children.map((ii) => {
                  return (
                    <div className={styles.thirdTitle} onClick={() => this.scroll(ii.id)}>
                      <span className={styles.desc}>{ii.name}&nbsp;</span>
                      <span className={styles.num}>{ii.amount}</span>
                    </div>
                  )
                })}
            </div>
          )
        })}
      </div>
    )
  }

  handleClick = (e) => {
    this.setState({
      visible: false,
      current: e.key
    })
  }

  showDrawer = (index) => {
    clearInterval(this.interval)
    this.setState({
      visible: true,
      current: index
    })
  }

  closeDrawer = (e) => {
    this.interval = setInterval(() => {
      this.setState({
        visible: false
      })
    }, 100)
  }

  render() {
    return <React.Fragment>{this.getMenu()}</React.Fragment>
  }
}

export default GlobalMenu
