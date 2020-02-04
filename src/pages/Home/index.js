import React, { Component } from 'react'
import { Grid, GridColumn, Image, Divider } from 'semantic-ui-react'
import MetaTags from 'react-meta-tags'
import { getCurrentUser, getAllCategories } from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';
import { HomeHeader, SearchBar, PhotoList } from '../../components'
import Footer from './Footer'
import CategoryCarousel from  './CategoryCarousel'
import PhotoDetails from './PhotoDetails'
import Bucket from './Bucket'
import './style.less'
import {notification} from 'antd'
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      categories: [],
      ImageShow: false,
      selImage:{},
      BucketShow: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.CloseImageModal = this.CloseImageModal.bind(this);
    this.CloseBucketModal = this.CloseBucketModal.bind(this);
    this.addToBucket = this.addToBucket.bind(this);
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  loadAllCategories() {
    getAllCategories()
    .then(response => {
      this.setState({
        categories: response.categories,
      });
      console.log("categories",this.state.categories);
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
    this.loadAllCategories();
  }

  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);
    console.log("aaa");
    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Photoing App',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Photoing App',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  handleImageClick(e){
    console.log("Image", e);
    this.setState({
      ImageShow: true,
      selImage: e
    })
  }

  CloseImageModal(flag){
    this.setState({
      ImageShow: flag
    })
  }

  CloseBucketModal(flag){
    this.setState({
      BucketShow: flag
    })
  }

  addToBucket(e, flag){
    this.setState({
      selImage: e,
      BucketShow: true
    })
  }

  render() {
    console.log("~!!~~!~!~!~!~!", this.state.selImage)
    return (
      <>
        <MetaTags>
          <title>Photographer - Image Platform</title>
        </MetaTags>
        <HomeHeader 
          isAuthenticated={this.state.isAuthenticated} 
          currentUser={this.state.currentUser} 
          onLogout={this.handleLogout}
        />
        <Grid className="pages page-index">
          <Grid.Row>
            <Grid.Column width={16}>
            <SearchBar />
            </Grid.Column>
            <Grid.Column width={16}>              
              <CategoryCarousel categories={this.state.categories} />
              <PhotoList 
                type="home_list" 
                onClickImage = {this.handleImageClick}
              />
              <PhotoDetails 
                show={this.state.ImageShow}
                photo = {this.state.selImage}
                handleClose={this.CloseImageModal}
                addToBucket = {this.addToBucket}
              />
              <Bucket 
                show={this.state.BucketShow}
                photo = {this.state.selImage}
                handleClose={this.CloseBucketModal}
              />
              <Footer />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    )
  }
}
export default Home
