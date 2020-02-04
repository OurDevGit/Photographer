import React, {Component} from 'react'
import { Dropdown } from 'semantic-ui-react'
import { getCurrentUser, getAllCategories, getAllTags, getNumberOfPhotos ,updateMultiplePhoto, submitMultiplePhoto} from '../../../util/APIUtils';
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
          tags: []
        }
        this.loadAllCategories = this.loadAllCategories.bind(this);
        this.loadAllTags = this.loadAllTags.bind(this);
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

    render(){
        const {visible} =  this.props;
        console.log("fasfsadfsdafsdf", this.state.categories)
        return(
            <div className={visible ? 'visible': 'disable'}>
                <div className='existingBuckets'>
                    <p>Existing Catetgories:</p>
                    {/* {keywords} */}
                </div>
                <div className='AddBucket'>
                    <p>Add New Category</p>
                </div>

                <div className='existingBuckets'>
                    <p>Existing Tags:</p>
                    {/* {keywords} */}
                </div>
                <div className='AddBucket'>
                    <p>Add New Tag</p>
                    
                </div>
            </div>
        )
    }
}  

export default CategoriesAndTags
