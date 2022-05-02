import React, { useEffect, useMemo } from 'react'
import Card from '@/components/Card'
import { useRequest } from '@dragon/hooks'
import {
  fetchCommodityDetail,
  exchangeCommodity,
  fetchCommodityRecords
} from '@/services/carbon/commodity'
import { usePageContext, withProvider } from './store'
import styles from './styles.less'
import { Tabs, Button, Modal, message, Table } from 'antd'
import Carousel from './components/Carousel'
import icon from '@/assets/certification.png'
import 'braft-editor/dist/output.css'
import { useTable } from '@dragon/hooks'
import PagingTable from '@/components/PagingTable'

import DescriptionList from './components/DescriptionList'
import router from 'umi/router'

const { Description } = DescriptionList

const { confirm } = Modal
const { TabPane } = Tabs

const View = (props) => {
  const { id } = usePageContext()

  // 获取设备详情
  const { loading, data: detail = {}, start: fetchDetail } = useRequest(fetchCommodityDetail, {
    manual: true
  })

  // 获取兑换记录
  const { tableProps } = useTable(fetchCommodityRecords, {
    defaultFilters: { goodsId: id },
    form: props.form
  })

  useEffect(() => {
    if (!!id) {
      fetchDetail({ goodsId: id })
    }
  }, [fetchDetail, id])

  const callback = () => {}

  const showConfirm = () => {
    confirm({
      title: '你确定要兑换此商品吗?',
      onOk() {
        exchangeCommodity({ goodsId: id }).then((res) => {
          if (res instanceof Error) return
          message.success('兑换成功')
          router.push('/mall/list')
        })
      }
    })
  }

  const columns = useMemo(() => {
    return [
      {
        title: '买方名称',
        dataIndex: 'userName',
        width: 120,
        ellipsis: true
      },
      {
        title: '碳币金额',
        dataIndex: 'goodsToken',
        width: 120,
        ellipsis: true
      },
      {
        title: '交易时间',
        dataIndex: 'createTime',
        width: 120,
        ellipsis: true
        // render: (t) => formatTime(t)
      }
      // {
      //   title: '交易描述',
      //   dataIndex: 'tradeDesc',
      //   width: 180,
      //   ellipsis: true
      // }
    ]
  }, [])

  return (
    <Card loading={loading} transparent>
      <Card>
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.top}>
              <div className={styles.show}>
                <Carousel goodsImg={detail.goodsImg} />
              </div>
              <div className={styles.info}>
                <p className={styles.title}>{detail.goodsName}</p>
                <DescriptionList style={{ marginBottom: 0 }}>
                  <Description label="商品编号" whole>
                    {id}
                  </Description>
                  <Description label="商品类别" whole>
                    {detail.goodsType}
                  </Description>
                  {/* <Description label="所在地" whole></Description> */}
                  <Description label="商品规格" whole>
                    {'标准'}
                  </Description>
                  <Description label="价格" whole>
                    <p className={styles.word}>
                      {detail.goodsPrice + '元' + detail.goodsToken + '碳币'}
                    </p>
                  </Description>
                </DescriptionList>
                {props.match.path === '/mall/list/view/:id' && (
                  <Button type="primary" className={styles.btn} onClick={showConfirm}>
                    我要兑换
                  </Button>
                )}
                <div style={{ marginTop: '8px' }}>
                  <span>剩余库存：{detail.stockTotal}</span>
                  <span style={{ marginLeft: '25px' }}>已兑换数量：{detail.exchangedTotal}</span>
                </div>
              </div>
            </div>
            <div className={styles.bottom}>
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="商品详情" key="1">
                  <div
                    className="braft-output-content"
                    dangerouslySetInnerHTML={{ __html: detail.goodsDesc }}
                  ></div>
                </TabPane>
                <TabPane tab="兑换记录" key="2">
                  <PagingTable rowKey={(i) => i.id} columns={columns} {...tableProps} />
                </TabPane>
              </Tabs>
            </div>
          </div>
          <div className={styles.right}>
            <h1 className={styles.title}>
              <img src={icon} alt="" className={styles.icon} />
              商家资质
            </h1>
            <div style={{ marginBottom: '16px' }}>杭州产链数字科技有限公司</div>
            <div style={{ marginBottom: '16px' }}>法定代表人：****</div>
            <div>注册资本：11,000 万元</div>
          </div>
        </div>
      </Card>
    </Card>
  )
}

const Page = withProvider((props) => {
  return {
    id: props.match.params.id
  }
})(View)
export default Page
