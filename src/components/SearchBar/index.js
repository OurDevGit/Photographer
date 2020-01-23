import React from 'react'
import { Button, Select, Input } from 'semantic-ui-react'
import './style.less'
const options = [
  { key: 'all', text: 'All', value: 'all' },
  { key: 'articles', text: 'Articles', value: 'articles' },
  { key: 'products', text: 'Products', value: 'products' },
]

const SearchBar = () => (
  <Input className='searchBar' type='text' placeholder='Search...' action>
    <Select compact options={options} defaultValue='articles' />
    <input />
    <Button type='submit'>Search</Button>
  </Input>
)

export default SearchBar