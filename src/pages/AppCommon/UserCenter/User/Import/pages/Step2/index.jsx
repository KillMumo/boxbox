import React, { useMemo, useCallback } from 'react'
import { Input, Button, TreeSelect } from 'antd'
import { Form, ListForm, Field } from '@dragon/form'
import Blank from '@/components/FormItems/Blank'
import ButtonGroup from '@/components/ButtonGroup'
import { usePageContext } from '../../store'
import { useRequest } from '@dragon/hooks'
import { tree as roles } from '@/services/role'
import { importUser } from '@/services/userManagement'
import PagingTable from '@/components/PagingTable'

const Step2 = (props) => {
  const {
    form,
    step: { onPrevious, next },
    select: { selectRecords2, setSelectRecords2 }
  } = usePageContext()

  const { loading: roleTreeLoading, data: roleTree = [] } = useRequest(roles)
  // 提交表单
  const { start: importReq } = useRequest(importUser, {
    manual: true
  })

  // 提交
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      form.validateFieldsAndScroll(async (err, values) => {
        if (!err) {
          const res = await importReq(format(values.records))
          if (res instanceof Error) return
          next()
        }
      })
    },
    [form, importReq, next]
  )

  const columns = useMemo(() => {
    return [
      {
        title: '',
        dataIndex: 'userId',
        width: 0,
        render: (t, r) => {
          return (
            <Field
              fieldKey={`records[${r.fieldKey}].userId`}
              name={`records[${r.name}].userId`}
              itemProps={{ style: { display: 'none' } }}
            >
              <Blank />
            </Field>
          )
        }
      },
      {
        title: '用户姓名',
        dataIndex: 'userName',
        width: 180,
        render: (t, r) => {
          return (
            <Field
              fieldKey={`records[${r.fieldKey}].userName`}
              name={`records[${r.name}].userName`}
              itemProps={{ style: { marginBottom: 0 } }}
            >
              <Blank />
            </Field>
          )
        }
      },
      {
        title: '手机号',
        dataIndex: 'account',
        width: 180,
        render: (t, r) => {
          return (
            <Field
              fieldKey={`records[${r.fieldKey}].account`}
              name={`records[${r.name}].account`}
              itemProps={{ style: { marginBottom: 0 } }}
            >
              <Blank />
            </Field>
          )
        }
      },
      {
        title: '所属机构',
        dataIndex: 'orgName',
        width: 260,
        ellipsis: true,
        render: (t, r) => {
          return (
            <Field
              fieldKey={`records[${r.fieldKey}].orgName`}
              name={`records[${r.name}].orgName`}
              itemProps={{ style: { marginBottom: 0 } }}
            >
              <Blank />
            </Field>
          )
        }
      },
      {
        title: (
          <div>
            <span>用户职位</span>
            <span style={{ color: '#E02020' }}>*</span>
          </div>
        ),
        dataIndex: 'position',
        width: 220,
        render: (t, r) => {
          return (
            <Field
              condition={{ required: true, name: '用户职位', type: 'input' }}
              fieldKey={`records[${r.fieldKey}].position`}
              name={`records[${r.name}].position`}
              itemProps={{ style: { marginBottom: 0 } }}
            >
              <Input placeholder="请输入" />
            </Field>
          )
        }
      },
      {
        title: (
          <div>
            <span>所属角色</span>
            <span style={{ color: '#E02020' }}>*</span>
          </div>
        ),
        dataIndex: 'roleIds',
        width: 220,
        render: (t, r) => {
          return (
            <Field
              condition={{ required: true, name: '所属角色', type: 'select', whitespace: false }}
              fieldKey={`records[${r.fieldKey}].roleIds`}
              name={`records[${r.name}].roleIds`}
              itemProps={{ style: { marginBottom: 0 } }}
              validateTrigger="onChange"
            >
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={roleTree}
                allowClear
                showSearch
                treeNodeFilterProp="title"
                multiple
                placeholder="请选择"
              />
            </Field>
          )
        }
      }
    ]
  }, [roleTree])

  return (
    <div style={{ marginTop: 56 }}>
      <Form
        form={form}
        initialValue={selectRecords2}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        onSubmit={handleSubmit}
      >
        <ListForm name="records">
          {(fields, { add, remove }) => {
            return (
              <PagingTable
                rowKey="key"
                columns={columns}
                dataSource={fields}
                style={{ marginBottom: 10 }}
                // scroll={{x:1080}}
              />
            )
          }}
        </ListForm>
        <ButtonGroup fixed align="center">
          <Button
            onClick={() => {
              setSelectRecords2(form.getFieldsValue())
              onPrevious()
            }}
          >
            上一步
          </Button>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </ButtonGroup>
      </Form>
    </div>
  )
}

export default Form.create()(Step2)

function format(arr) {
  let newArr = []
  arr.forEach((current) => {
    let newObj = {}
    for (let i in current) {
      if (i === 'roleIds') {
        newObj['roleIds'] = current[i].join(',')
      } else newObj[i] = current[i]
    }
    newArr.push(newObj)
  })
  return newArr
}
