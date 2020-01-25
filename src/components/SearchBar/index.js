import React from 'react'
import { Button, Select, Input } from 'semantic-ui-react'
import './style.less'
const options = [
  { key: 'all', text: 'All', value: 'all' },
  { key: 'articles', text: 'Images', value: 'images' },
  { key: 'products', text: 'Videos', value: 'videos' },
]

const SearchBar = () => (
  <Input className='searchBar' type='text' placeholder='Search...' action>
    <Select className="sele" compact options={options} defaultValue='all' />
    <input />
    <Button type='submit'>Search</Button>
  </Input>
)

export default SearchBar