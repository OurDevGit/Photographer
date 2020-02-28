import React, {Component} from 'react'
import { Dropdown, Input, Button, Grid, Modal, List, Checkbox, Rating, Label } from 'semantic-ui-react'
import { getCurrentUser,getRejectingMotives, adminAcceptPhoto, adminRejectPhoto, adminRedeemPhoto} from '../../../util/APIUtils';
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
          rating: 0,
          selMotives:[],
          action: false,
          photoActive:null,
          publish: false
          // motives:[]
          // photo: {}
        }
        this.loadCurrentUser =  this.loadCurrentUser.bind(this);
        this.handleImageClick =  this.handleImageClick.bind(this);
        this.handleRate =  this.handleRate.bind(this);
        this.loadRjectingMotives = this.loadRjectingMotives.bind(this)
        this.handleMotiveCheck =  this.handleMotiveCheck.bind(this)
        this.handleAcceptClick =  this.handleAcceptClick.bind(this)
        this.handleRejectClick =  this.handleRejectClick.bind(this)
        this.handleRedeemClick =  this.handleRedeemClick.bind(this)
        this.handlePrevPhoto = this.handlePrevPhoto.bind(this)
        this.handleNextPhoto = this.handleNextPhoto.bind(this)
      }
    componentDidMount(){
      this.loadCurrentUser();
      this.loadRjectingMotives()
    }

    componentDidUpdate(prevProps) {
      if(this.props.status !== prevProps.status)
      {
          this.setState({
            photo: null,
            photoActive: null,
          });
      }
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

    loadRjectingMotives() {
      this.setState({
        isLoading: true
      });
      getRejectingMotives()
      .then(response => {
        console.log(response)
        this.setState({
          motives: response,
          isLoading: false
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });  
      });
    }

    handleImageClick(e, index, total){
      
      if(total >0){
        var zoomImage = [<div className="zoomImage"><PanAndZoomImage src={e.photo.url_fr} /></div>]
        this.setState({
          photo : e.photo,
          photoActive: index,
          rating: e.photo.rating,
          total: total,
          selMotives: [],
          zoomImage
        })
      }else{
        this.setState({
          photo: null
        })
      }
     
    }

    handleRate(e, {rating}){
      this.setState({
        rating: rating
      })
    }

    handleMotiveCheck(e,{label, checked, value}){
      if(checked)
      {
        this.state.selMotives.push(value);
      }else{
        this.state.selMotives = this.state.selMotives.filter(item=> item != value);
      }
      this.setState({
        selMotives: this.state.selMotives
      })
    }

    handleNextPhoto(){
      this.setState({
        photoActive: this.state.photoActive + 1,
        action: !this.state.action
      })
    }

    handlePrevPhoto(){
      this.setState({
        photoActive: this.state.photoActive - 1,
        action: !this.state.action
      })
    }
    handleAcceptClick(){
      
      var acceptRequest = {
              "photoToManage": this.state.photo.id,
              "rating": this.state.rating
          }
      adminAcceptPhoto(acceptRequest)
      .then(response => {
        this.setState({
          publish: !this.state.publish,
        })
      }).catch(error => {
          console.log("error", error)
      });

    }

    handleRejectClick(){
      if(this.state.selMotives.length == 0){
        alert("select some rejecting motives")
      }else{
        var rejectRequest = {
          "photoToManage": this.state.photo.id,
          "motivesForRejectingIds":this.state.selMotives,
          "rating": this.state.rating
        }
        adminRejectPhoto(rejectRequest)
        .then(response => {
          this.setState({
            publish: !this.state.publish,
          })
        }).catch(error => {
            console.log("error", error)
        });
      }
    }
    handleRedeemClick(){
      var redeemRequest = [];
      redeemRequest.push(this.state.photo.id)
      adminRedeemPhoto(redeemRequest)
      .then(response => {
        this.setState({
          publish: !this.state.publish,
        })
      }).catch(error => {
          console.log("error", error)
      });

    }

    render(){
        const {visible} =  this.props;
        const keywords = [];
        const releases = [];
        const list_motives = [];
        var buttonGroup = []; 
        if(this.state.motives && this.state.photo)
        {
          if(!this.state.photo.rejectingMotives)
          {
            this.state.photo.rejectingMotives = [];
          }
          var motiveFlag = [];
          for(let i=0; i<this.state.photo.rejectingMotives.length; i++)
          {
            motiveFlag[this.state.photo.rejectingMotives[i].id] = 1;
          }
          this.state.motives.forEach((motive, motiveIndex) => {
            list_motives.push(
              <List.Item key={motiveIndex}>
                {
                  this.props.status == 'list_rejected_photos' ?
                    <Checkbox label={motive.value} value={motive.id} onClick={this.handleMotiveCheck} checked={motiveFlag[motive.id] == 1} disabled/>

                  : <Checkbox label={motive.value} value={motive.id} onClick={this.handleMotiveCheck} />
                }
                
              </List.Item>
            );
          });
        }
        if(this.props.status == 'list_submitted_photos')
        {
          buttonGroup = [
            <Button.Group>
              <Button positive onClick={this.handleAcceptClick}>Accept</Button>
              <Button.Or />
              <Button negative onClick={this.handleRejectClick}>Reject</Button>
            </Button.Group>
          ]
        }else if(this.props.status == 'list_accepted_photos'){
          buttonGroup = [
            <Button.Group>
              <Button negative onClick={this.handleRejectClick}>Reject</Button>
            </Button.Group>
          ]
        }else if(this.props.status == 'list_rejected_photos'){
          buttonGroup = [
            <Button.Group>
              <Button positive onClick={this.handleAcceptClick}>Accept</Button>
              <Button.Or />
              <Button negative onClick={this.handleRedeemClick}>Redeem</Button>
            </Button.Group>
          ]
        }

        if(this.state.photo)
        {
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
            <div className={visible ? 'admin_photo visible': 'admin_photo disable'} id='PhotoContent'>
              <Grid>
                <Grid.Row>
                  <Grid.Column className='admin_photolist' width='3'>
                    {
                      this.state.currentUser && visible ?
                        <div className='adminPhotolist'>
                          <PhotoList
                            onClickImage={this.handleImageClick} 
                            username ={this.state.currentUser.username} 
                            type="admin_photolist" 
                            status= {this.props.status}
                            active= {this.state.photoActive}
                            action= {this.state.action}
                            publish = {this.state.publish}
                          />
                        </div>
                      : null
                    }
                  </Grid.Column>
                  <Grid.Column className='admin_photocontent' width = '13'>
                    {
                      this.state.photo ?
                        <Grid verticalAlign='middle'>
                          <Grid.Row className=''>
                            <Grid.Column width='10'>
                              {/* <PanAndZoomImage
                                src={url}
                              /> */}
                              <div className="zoomImage">
                                <a>Zoom : Shift + scroll</a>
                                <PanAndZoomImage src={url} />
                                </div>
                              {/* {this.state.zoomImage} */}
                            </Grid.Column>
                            <Grid.Column width='6'>
                              <div className='photoDetail'>
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
                                <p>
                                  FollowIGLink: <b> {this.state.photo.FollowIGLink}</b>
                                </p>
                                <div className='keywords'>
                                  <p>Keywords</p>
                                  {keywords}
                                </div>
                              </div>
                              <div className='photoReleases'>
                                <div className='keywords'>
                                  <p>Releases</p>
                                  {releases}
                                </div>
                              </div>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row className='GridRow'>
                            <Grid.Column  width='5'>
                              <List className='rejectingMotivesList'>
                                {list_motives}
                              </List>
                            </Grid.Column>
                            <Grid.Column className='actionButtonGroup buttonGroup' width='5'>

                              <p><span>IG ADMIN LINK:</span><Input placeholder="IG ADMIN LINK" /></p>
                              Rating:<Rating maxRating={10} rating={this.state.rating} icon='star' size='tiny' onRate={this.handleRate} /><br /><br />
                              {buttonGroup}
                            </Grid.Column>
                            <Grid.Column className='next_prevButtonGroup buttonGroup' width='6'>
                                <Button content='Prev' icon='left arrow' labelPosition='left' onClick={this.handlePrevPhoto} disabled={this.state.photoActive == 0}/>
                                <Button content='Next' icon='right arrow' labelPosition='right' onClick={this.handleNextPhoto} disabled={this.state.total == this.state.photoActive + 1}/>
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
