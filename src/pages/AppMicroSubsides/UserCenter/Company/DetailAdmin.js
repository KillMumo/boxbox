import React from 'react'
import Card from '@/components/Card'
import { useRequest } from '@dragon/hooks'
import { fetchDetailAdmin } from '@/services/microSubsidy/userCenter'
import DescriptionList from '@/components/DescriptionList'

const View = (props) => {
  const { loading, data = {} } = useRequest(fetchDetailAdmin)

  return (
    <Card loading={loading} transparent>
      <Card title="企业信息">
        <DescriptionList>
          <DescriptionList.Description label="企业全称">
            宁波市海曙国有资本投资经营集团有限公司
          </DescriptionList.Description>
          <DescriptionList.Description label="社会统一信用代码">
            91330203MA292R4P3C
          </DescriptionList.Description>
        </DescriptionList>
      </Card>
      <Card title="管理员信息">
        <DescriptionList>
          <DescriptionList.Description label="管理员姓名">{data.name}</DescriptionList.Description>
          <DescriptionList.Description label="管理员手机号">
            {data.phone}
          </DescriptionList.Description>
        </DescriptionList>
      </Card>
    </Card>
  )
}

export default View
