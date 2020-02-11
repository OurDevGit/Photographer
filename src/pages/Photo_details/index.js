import React, { Component } from 'react'
import { Grid, Button, Icon, Label, GridRow } from 'semantic-ui-react'
import MetaTags from 'react-meta-tags'
import { getCurrentUser, getAllCategories, getPhotoDetail } from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';
import { HomeHeader, SearchBar, PhotoList } from '../../components'
import PanAndZoomImage from '../../PanAndZoomImage';
import ImageCarousel from  './ImageCarousel'
import { Heart_Icon, Plus_Icon, Zoom_Icon, CloseIcon} from '../../assets/icons'
import './style.less'
import {notification} from 'antd'
class Photo_details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      categories: [],
      ImageShow: false,
      selImage:{},
      similarPhotos:[],
      likes:192,
      BucketShow: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.loadPhotoDetail = this.loadPhotoDetail.bind(this)
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

  loadPhotoDetail(id){
    getPhotoDetail(id)
      .then(response=>{
        console.log("res_photodetail",response)
        this.setState({
          selImage: response.photoDto,
          similarPhotos: response.similarPhotos.content
        })
      })
      .catch(error=>{
        console.log('error', error)
      })
  }

  componentDidMount() {
    this.loadCurrentUser();
    this.loadAllCategories();
    this.loadPhotoDetail(this.props.match.params.id);
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
    this.props.history.push('/Photo_details/${4324}');
    this.setState({

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
    const {selImage, similarPhotos} = this.state;
    const keywords = [];
    var url = ''
    if(selImage.tags){
      console.log("---------------------------", selImage.tags.length)
      for(let i=0; i<selImage.tags.length;i++)
      {
          keywords.push(<button>{selImage.tags[i].value}</button>)
      }
      url = selImage.url_fr + ''
    }

    console.log("~!!~~!~!~!~!~!", similarPhotos)
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
        <Grid className="photo_details" verticalAlign='middle'>
          <Grid.Row className='photo_details_row'>
            <Grid.Column width={12}>
            <div className='zoomImage'>
                <a target='blank' href={url}><Zoom_Icon className="detail_Icon Zoom-icon" /></a>
                <a ><Heart_Icon className="detail_Icon Heart-icon"/></a>
                <a ><Plus_Icon className="detail_Icon Plus-icon" /></a>  
                <Button as='div' className='loveImageButton' labelPosition='right'>
                  <Button color='red'>
                    <Icon name='heart' />
                    Like
                  </Button>
                  <Label as='a' basic color='red' pointing='left'>
                    {this.state.likes}
                  </Label>
                </Button>
              <PanAndZoomImage src={url}>

              </PanAndZoomImage>
            </div>
            </Grid.Column>
            <Grid.Column width={4}>    
            <div className='photoDetail'>
              <p>
                This Content is created by <a href=""><b>{selImage.owner}</b></a>.
              </p>
              <p>
                Image# <a href=""><b>{url.split('/')[url.split('/').length-1]}</b></a>.
              </p>
              <p>
                uploaded: <b> June 18, 2018 11:14 AM</b>
              </p>
              <p>
                Releases: <b> Has {selImage.authorizations ? selImage.authorizations.length : ''}  model release</b>
              </p>
              <p>
                Descriptions: <b>{selImage.description}</b>
              </p>
              <div className='keywords'>
                <p>Keywords</p>    
                {keywords}                
              </div>
            </div>
            {/* <div className='photoReleases'>
              <div className='keywords'>
                <p>Releases</p>
              </div>
            </div>                      */}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <a className="relatedPhotosLabel">Related Photos</a> <a>See All</a>
              <ImageCarousel 
                photo =  {this.state.similarPhotos}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    )
  }
}
export default Photo_details
