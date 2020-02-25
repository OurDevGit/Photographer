import React, {Component} from 'react'
import { Dropdown, Input, Button } from 'semantic-ui-react'
import { getCurrentUser, getAllCategories, getAllTags, addNewTag} from '../../../util/APIUtils';
import './style.less'
class CategoriesAndTags extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
          visible: '',
          categories: [],
          tags: [],
          inputValue:[]
        }
        this.loadAllCategories = this.loadAllCategories.bind(this);
        this.loadAllTags = this.loadAllTags.bind(this);
        this.handleAddTag = this.handleAddTag.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this)
      }
    componentDidMount(){
        this.loadAllTags();
        this.loadAllCategories();
    }
    loadAllCategories() {
        getAllCategories()
        .then(response => {
          let categorylist = response.categories.map((category)=>{
            return{
              key: category.id,
              value: category.value,
              text: category.value
            }
          });
          this.setState({
            categories: categorylist,
          });
        }).catch(error => {
          this.setState({
            isLoading: false
          });  
        });
    }
    
    loadAllTags() {
        getAllTags()
        .then(response => {
          let taglist = response.tags.map((tag)=>{
            return{
              key: tag.id,
              value: tag.value,
              text: tag.value
            }
          });
          this.setState({
            tags: taglist,
          });
        }).catch(error => {
          this.setState({
            isLoading: false
          });  
        });
    }

    handleAddTag(e){
      if(!this.state.inputValue['newTag'] || this.state.inputValue['newTag'] == '')
      {
        alert('Put Tag name please')
      }else{
        addNewTag(this.state.inputValue['newTag'])
        .then(response =>{
          console.log(response)
        })
        .catch(error=>{
          console.log(error)
        })
      }
    }
    handleInputChange(e, {name, value}){
      
      this.state.inputValue[name] = value
      this.setState({
        inputValue: this.state.inputValue
      })
    }

    render(){
        const {visible} =  this.props;
        const keywords = [];
        this.state.tags.forEach((tag, tagIndex) => {
          keywords.push(<button className='value'>{tag.value}</button>)
        });
        const categories = [];
        this.state.categories.forEach((category, categoryIndex) => {
          categories.push(<button className='value'>{category.value}</button>)
        });
        return(
            <div className={visible ? 'visible': 'disable'} id='CategoryAndTag'>
              <div className='column Category'>
                <div className='AddCategory'>
                    <h3>Add New Category : 
                    <Input type='text' placeholder='New Category...' action onChange={this.handleInputChange}>
                      <input />
                      <Button type='button'>Add</Button>
                    </Input>
                    </h3>
                </div>
                <div className='existingCategories'>
                    <h3>Existing Catetgories:
                    <Input size='small' icon='search' placeholder='Search...' onChange={this.handleInputChange}/>
                    </h3>
                    {categories}
                </div>
              </div>
              <div className='column Tag'>
                <div className='AddTag'>
                  <h3>Add New Tag : 
                    <Input type='text' name='newTag' placeholder='New Tag...' action onChange={this.handleInputChange}>
                      <input />
                      <Button type='button' onClick={this.handleAddTag}>Add</Button>
                    </Input>
                  </h3>
                </div>
                <div className='existingTags'>
                    <h3>Existing Tags:
                    <Input size='small' icon='search' placeholder='Search...' onChange={this.handleInputChange}/>
                    </h3>
                    {keywords}
                </div>
              </div>
            </div>
        )
    }
}  

export default CategoriesAndTags
