import React, { useMemo } from 'react'
import Card from '@/components/Card'
import PagingTable from '@/components/PagingTable'
import ButtonGroup from '@/components/ButtonGroup'
import { Button, Form } from 'antd'
import { useTable } from '@dragon/hooks'
import ListCover from '@/components/ListCover'
import { fetchCommodityList } from '@/services/carbon/commodity'
import { Link } from 'react-router-dom'

const List = (props) => {
  //获取企业列表
  const { tableProps } = useTable(fetchCommodityList, {
    form: props.form
  })

  //表头
  const columns = useMemo(() => {
    return [
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        width: 300,
        fixed: 'left',
        render: (t, r) => {
          // 提取出商品图片字符串中的url
          let arr = r.goodsImg.match(/\url+.*?\,/g) || []
          let coverUrl = arr?.[0].slice(4, arr[0].length - 1) || ''
          return <ListCover name={t} url={coverUrl} />
        }
      },
      {
        title: '商品价格',
        dataIndex: 'goodsToken',
        width: 120,
        ellipsis: true
      },
      {
        title: '库存',
        dataIndex: 'stockTotal',
        width: 120,
        ellipsis: true
      },
      {
        title: '发布时间',
        dataIndex: 'createTime',
        width: 150
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (t, r) => {
          return (
            <ButtonGroup type="action">
              <Button>
                <Link
                  to={{
                    pathname:
                      props.match.path === '/commodity/list'
                        ? `/commodity/list/view/${r.goodsId}`
                        : `/mall/list/view/${r.goodsId}`
                  }}
                >
                  查看
                </Link>
              </Button>
              {/* {props.match.path === '/commodity/list' && (
                <Button to={`/commodity/list/edit/${r.goodsId}`}>编辑</Button>
              )} */}
            </ButtonGroup>
          )
        }
      }
    ]
  }, [props.match.path])

  return (
    <Card transparent>
      <Card>
        {props.match.path === '/commodity/list' && (
          <ButtonGroup>
            <Button to="/commodity/list/add" type="primary">
              发布商品
            </Button>
          </ButtonGroup>
        )}
        <PagingTable rowKey={(i) => i.goodsId} columns={columns} {...tableProps} />
      </Card>
    </Card>
  )
}

export default Form.create()(List)
