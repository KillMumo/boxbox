import React,{ useEffect, useState} from 'react'
import DescriptionList from '@/components/DescriptionList'
import Card from '@/components/Card'
import { getDictDetail } from '@/services/dict'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import ButtonGroup from '@/components/ButtonGroup'
import { useRequest } from '@dragon/hooks'
import { fetchDetail } from '@/services/carbonAccount/reduction'
import { getMethodList} from '@/services/carbonAccount/reduction'
import DownloadItem from '@/components/DownloadItem'

const Description = DescriptionList.Description
const View = (props) => {
  const {
    params: { id }
  } = props.match

  const { loading, data: info = {} } = useRequest(() => fetchDetail({ bizNo:id }))

  const buttonlayout = {
    labelAlign: 'right',
    labelCol: { span: 11 },
    wrapperCol: { span: 13 },
    colon: false
  }

  const [methodfile,setmethodfile]=useState([])

  const requestMethod=()=>{
    getMethodList().then((res)=>{
      // console.log('mettttthod',res.records[0])
      setmethodfile(res.records[0])
    })
  }

  useEffect(() => {
    requestMethod()
  },[])

  return (
    <Card loading={loading}>
      <DescriptionList column={2}>
        <Description label="项目编号">{info?.extra?.bizNo}</Description>
        <Description label="项目名称">{info?.extra?.projectName}</Description>
        <Description label="项目类型">{info?.extra?.methodScene}</Description>
        <Description label="项目点">{info?.extra?.place[0]+info?.extra?.place[1]+info?.extra?.place[2]+info?.extra?.rest}</Description>
        <Description label="建设规模(MW)">{info?.extra?.scale}</Description>
        <Description label="备案文件号">{info?.extra?.fileNum}</Description>
        <Description label="备案时间">{info?.extra?.fileTime}</Description>
        <Description label="开始(并网)时间">{info?.extra?.startTime}</Description>
        <Description label="项目备案证/产权证明文件" whole>
          <DownloadItem list={info?.extra?.attachment|| []} />
          {/* <a
            onClick={() =>
              window.open(
                '/matrix/biz-file/downloadFile?path=' + encodeURI(info?.extra?.attachment[0]?.url)
              )
            }
          >
            {info?.extra?.attachment[0]?.name}
          </a> */}
        </Description>
        <Description label="方法学版本" whole>
            {/* <DownloadItem list={methodfile?.extra?.methodFile||[]} /> */}
            <Button onClick={() => {
              localStorage.setItem("methoddetail", JSON.stringify('分布式光伏'))
              // router.push(`/methodMgr/view`,'_blank')
              window.open(`/methodMgr/view`, '_blank')
            }}>查看</Button>
        </Description>
        <Description label="描述" whole>
          {info?.extra?.desc}
        </Description>
        <ButtonGroup {...buttonlayout}>
          <Button >
            <Link to={"/reduction/list"}>返回</Link>
          </Button>
        </ButtonGroup>
      </DescriptionList>

    </Card>
  )
}

export default View
