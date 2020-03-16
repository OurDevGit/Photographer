import React, {Component} from 'react'
import { Button, Select, Input } from 'semantic-ui-react'
import './style.less'


const options = [
  { key: 'all', text: 'All', value: 'all' },
  { key: 'articles', text: 'Images', value: 'images' },
  { key: 'products', text: 'Videos', value: 'videos' },
]

const orderoptions = [
  { key: 'rating', text: 'Rating', value: 'Rating' },
  { key: 'weight', text: 'Weight', value: 'Weight' },
  { key: 'likes', text: 'Likes', value: 'Likes' },
  { key: 'downloads', text: 'Downloads', value: 'Downloads' },
  { key: 'viewed', text: 'Viewed', value: 'Viewed' },
  { key: 'date', text: 'Date', value: 'Date' },
  { key: 'title', text: 'Title', value: 'Title' },
  { key: 'description', text: 'Description', value: 'Description' },
]

class SearchBar extends Component {
  constructor(props) {
    super(props);
      this.state = {
        searchKey: "",
        order:"Date"
    }
    this.handleChangeSearchKey =  this.handleChangeSearchKey.bind(this)
    this.handleClickSearch =  this.handleClickSearch.bind(this)
    this.handleSelectOrder = this.handleSelectOrder.bind(this)
  }

  componentDidMount(){
    var test = [{
      "label": "key",
      "value": "girl with hat"
      },
      {
        "label": "tag",
        "value": "hat"
      }
    ];
    var searchOptions = ""
    test.forEach(t => {
      searchOptions = searchOptions + "&" + t.label + "=" + t.value;
    });
    console.log("search~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",searchOptions)
  }

  handleChangeSearchKey(e, {value}){
    this.setState({
      searchKey: value
    })
    console.log(value);                                                                                                                   
  }

  handleClickSearch(){
    console.log(this.state.order, this.state.searchKey)
    
    
    if(this.state.searchKey != ""){
      var SearchOptions = [{
        "label": "key",
        "value": this.state.searchKey
      }]
    }else{
      var SearchOptions = []
    }
    this.props.clickSearch(SearchOptions)
  }

  handleSelectOrder(e, {value}){
    this.setState({
      order:value
    })
    console.log(value)
  }

  render(){
    return(
      <Input className='searchBar' type='text' placeholder='Search...' name="searchKey" value={this.state.searchKey} onChange={this.handleChangeSearchKey} action>
        <Select className="sele" compact options={options} defaultValue='all' />
        <input />
        <Select className="sele" compact options={orderoptions} value={this.state.order} onChange={this.handleSelectOrder} />
        <Button onClick={this.handleClickSearch}>Search</Button>
      </Input>
    )
  }
}

export default SearchBar