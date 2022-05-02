import Card from '@/components/Card'
import React from 'react'
import { Link } from 'umi'

const Type = props => {

  return (
    <div>
      <Card style={{ width: 300 }}>
       <Link to={"/reduction/add"} >分布式光伏</Link>
      </Card>
    </div>
  )
}

export default Type
