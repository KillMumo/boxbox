import React from 'react'
import Result from '@/components/Result'
import Link from 'umi/link'
import { Button } from 'antd'
import { useSelector } from 'react-redux'
import ButtonGroup from '@/components/ButtonGroup'

const Step3 = () => {
  const modifyState = useSelector(({ modifyPhone }) => modifyPhone.info)
  //const dispatch = useDispatch()
  // useEffect(() => {
  //   //   // 获取用户信息
  //   //   dispatch({
  //   //     type: 'user/fetchUser'
  //   //   })
  //   // }, [dispatch])

  return (
    <Result
      type="success"
      title="完成修改"
      desc={`手机号码已修改，您的手机号码为${modifyState.newPhone}`}
    >
      <ButtonGroup align="center">
        <Button type="primary">
          <Link to="/account/settings">返回基本信息</Link>
        </Button>
      </ButtonGroup>
    </Result>
  )
}

export default Step3
