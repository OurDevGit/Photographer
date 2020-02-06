import React, {Component} from 'react'
import { Dropdown, Input, Button, Grid, Modal, List } from 'semantic-ui-react'
import { getCurrentUser, getAllCategories, getAllTags, getNumberOfPhotos ,updateMultiplePhoto, submitMultiplePhoto} from '../../../util/APIUtils';
import { HomeHeader, PhotoList, AvatarImage, MultiSelect, ListComponent } from '../../../components'
import PanAndZoomImage from '../../../PanAndZoomImage';
import './style.less'
class PhotoContent extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
          isAuthenticated: false,
          isLoading: false,
          visible: '',
          categories: [],
          tags: [],
          // photo: {}
        }
        this.loadCurrentUser =  this.loadCurrentUser.bind(this);
        this.handleImageClick =  this.handleImageClick.bind(this);
      }
    componentDidMount(){
      this.loadCurrentUser();
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

    handleImageClick(e, flag){
      this.setState({
        photo : e.photo
      })
    }

    render(){
        const {visible} =  this.props;
        const keywords = [];
        const releases = [];
        if(this.state.photo)
        {
          console.log(this.state.photo.authorizations)
          var url = this.state.photo.url_fr + ''
          
          const tags = this.state.photo.tags ? this.state.photo.tags : []
          tags.forEach((tag, tagIndex) => {
            keywords.push(<button>{tag}</button>)
          });
          this.state.photo.authorizations.forEach((authorization, Index) => {
            releases.push(
              <Modal trigger={<Button
                className='releaseIcons' 
                type='button' 
                size='small' 
                content={authorization.caption}
                icon='id card' 
                labelPosition='left' 
              />}>
                <Modal.Header>
                  <List divided relaxed className="ListComponent">
                    <List.Item>
                    <List.Icon name='id card' size='large' verticalAlign='middle' />
                      <List.Content>
                        <List.Header>{authorization.caption}</List.Header>
                        {authorization.authorizationKind}
                      </List.Content>
                    </List.Item>
                  </List>             
                </Modal.Header>
                <Modal.Content image>
                    <PanAndZoomImage
                        src={authorization.documentUrl}
                    />
                  <Modal.Description>
                  </Modal.Description>
                </Modal.Content>
              </Modal>
              
              )
          });
        }
      
        return(
            <div className={visible ? 'visible': 'disable'} id='PhotoContent'>
              <Grid>
                <Grid.Row>
                  <Grid.Column className='admin_photolist' width='3'>
                    {
                      this.state.currentUser ?
                        <div className='adminPhotolist'>
                          <PhotoList 
                            onClickImage={this.handleImageClick} 
                            username ={this.state.currentUser.username} 
                            type="Submit_operation" 
                            status="TO_BE_SUBMITTED"
                          />
                        </div>
                      : null
                    }
                  </Grid.Column>
                  <Grid.Column className='admin_photocontent' width = '13'>
                    {
                      this.state.photo ?
                        <Grid verticalAlign='middle'>
                          <Grid.Row>
                            <Grid.Column width='10'>
                              <PanAndZoomImage
                                src={url}
                              />
                            </Grid.Column>
                            <Grid.Column width='6'>
                              <p>
                                This Content is created by <a href=""><b>{this.state.photo.owner}</b></a>.
                              </p>
                              <p>
                                Image# <a href=""><b>{url.split('/')[url.split('/').length-1]}</b></a>.
                              </p>
                              <p>
                                uploaded: <b> June 18, 2018 11:14 AM</b>
                              </p>
                              <p>
                                Releases: <b> Has {this.state.photo.authorizations.length} model release</b>
                              </p>
                              <p>
                                Descriptions: <b> {this.state.photo.description}</b>
                              </p>
                              <div className='keywords'>
                                <p>Keywords</p>
                                {keywords}
                              </div>
                              <div className='keywords'>
                                <p>Releases</p>
                                {releases}
                              </div>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      : null
                    }
                    
                  </Grid.Column>
                </Grid.Row>
              
              </Grid>
            </div>
        )
    }
}  

export default PhotoContent
