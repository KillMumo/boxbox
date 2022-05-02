import React from 'react'
import SearchForm from '@/components/SearchForm'
import Card from '@/components/Card'
import { Select } from 'antd'

const Search1 = () => {
  return (
    <Card>
      <SearchForm enterprise={true} industry={true} street={true} year={true} />
    </Card>
  )
}
export default Search1
