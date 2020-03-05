import React, { Component } from 'react';
import MetaTags from 'react-meta-tags'
import { Grid, Form, Input, Select, Icon, Button, Image, Tab} from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { API_BASE_URL, ACCESS_TOKEN} from '../../../constants';
import { update_user, getCurrentUser, getUserDetail } from '../../../util/APIUtils';
import { getAvatarColor } from '../../../util/Colors';
import { formatDate } from '../../../util/Helpers';
import LoadingIndicator  from '../../../common/LoadingIndicator';
import './style.less';
import NotFound from '../../../common/NotFound';
import ServerError from '../../../common/ServerError';
import {Avatar, UserCard, HomeHeader, HomeFooter} from '../../../components'
import Footer from '../Footer'
import {
    AvatarDefault
  } from '../../../assets/images/homepage'
import PersonalInfo from './PersonalInfo'
import Security from './Security'
import Friends from './Friends'
import Analyse from './Analyse'
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            currentUser: null,
            isAuthenticated: false,
            isAvatarLoading: false,
            user_avatar_url: AvatarDefault,
            uploadLabel: 'Upload your photo'
        }

        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.uploadAvatar =  this.uploadAvatar.bind(this)
        this.update_userData =  this.update_userData.bind(this)
    }

    loadCurrentUser(userId) {
        this.setState({
          isLoading: true
        });
        getCurrentUser()
        .then(response => {
          this.loadUserProfile(userId)
          this.setState({
            currentUser: response,
            isAuthenticated: true,
            // isLoading: false
          });
        }).catch(error => {
          this.setState({
            isLoading: false
          });  
        });
    }

    loadUserProfile(userId) {
        this.setState({
            // isLoading: true
        });

        getUserDetail(userId)
        .then(response => {
            console.log("userdeta",response)
            this.setState({
                user: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }

    uploadAvatar(e){
        this.setState({
            isAvatarLoading: true
        })
        var url = URL.createObjectURL(e.target.files[0]);
        var myHeaders = new Headers({})
        if(localStorage.getItem(ACCESS_TOKEN)) {
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
        }
        const formData = new FormData();
        formData.append('files', e.target.files[0]);
    
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow'
          };
          fetch(API_BASE_URL + "/public/users/submitMultiplePhoto", requestOptions)
          .then(response => {
              if(response.ok){
                this.state.user.avatar = url;
                this.setState({
                    user: this.state.user,
                    isAvatarLoading: false,
                    uploadLabel: 'Change your photo'
                })
                this.setState({
                    isAvatarLoading: false
                })
                console.log("uploadAvatar", response)
              }
          })
          .catch(error => {
              console.log('error', error)
              this.setState({
                isAvatarLoading: false
              });
            });    
    }

    update_userData(e){
      console.log(e)
      update_user(e)
      .then(response=>{
        console.log(response)
      })
      .catch(error=>{
        console.log(error)
      })
    }
      
    componentDidMount() {
        const userId = this.props.match.params.id;
        // this.loadUserProfile(userId);
        this.loadCurrentUser(userId);
    }

    componentDidUpdate(nextProps) {
        // if(this.props.match.params.username !== nextProps.match.params.username) {
        //     this.loadUserProfile(nextProps.match.params.username);
        // }        
    }

    render() {
      console.log(this.state.currentUser)

        const panes = [
            { menuItem: 'Personal Info', render: () => <Tab.Pane><PersonalInfo user={this.state.user} update_userData={this.update_userData} /></Tab.Pane> },
            { menuItem: 'Security', render: () => <Tab.Pane><Security user={this.state.user}/></Tab.Pane> },
            { menuItem: 'Follow', render: () => <Tab.Pane><Friends user={this.state.user} /></Tab.Pane> },
            { menuItem: 'Analyse', render: () => <Tab.Pane><Analyse user={this.state.user} /></Tab.Pane> },
            { menuItem: 'Photos', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
          ]
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        if(!this.state.isLoading && !this.state.currentUser)
        {
            // return <Redirect to='/user/LoginAndSignUp' />
        }

        return (
            <div className="profile">
                { 
                    this.state.user ? (
                        
                        <>
                        <MetaTags>
                          <title>Photographer - Image Platform</title>
                        </MetaTags>
                        <HomeHeader 
                          isAuthenticated={this.state.isAuthenticated} 
                          currentUser={this.state.currentUser} 
                          onLogout={this.handleLogout}
                        />
                        <Grid className="pages page-index profile_page">
                          {
                            this.state.currentUser && this.state.user.id == this.state.currentUser.id ? 
                              <Grid.Row>
                                <Grid.Column width={4}>              
                                    {/* <UserCard className='UserAvata' user={this.state.user} /> */}
                                    <div className='avatar'>
                                        {
                                            this.state.isAvatarLoading ? <LoadingIndicator />
                                            :  <div className='avatarUpload'>
                                                    <input type="file" accept="image/*" className="imageUpload input" name="file" onChange={this.uploadAvatar} />
                                                    <Button className='imageUpload button'>{this.state.uploadLabel}</Button>
                                                </div>
                                        }
                                        <Image src={this.state.user.avatar ? this.state.user.avatar : AvatarDefault} className={this.state.isAvatarLoading ? 'avatar_image':''} circular />
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Tab panes={panes} />    
                                    {/* <Tab panes={panes} menu={{ fluid: true, vertical: true, tabular: true }} />       */}
                                </Grid.Column>
                              </Grid.Row>
                              : 
                              <Grid.Row>
                                <Grid.Column width={4}>              
                                    {/* <UserCard className='UserAvata' user={this.state.user} /> */}
                                    <div className='avatar'>
                                        {
                                            this.state.isAvatarLoading ? <LoadingIndicator />
                                            :  <div className='avatarUpload'>
                                                    <input type="file" accept="image/*" className="imageUpload input" name="file" onChange={this.uploadAvatar} />
                                                    <Button className='imageUpload button'>{this.state.uploadLabel}</Button>
                                                </div>
                                        }
                                        <Image src={this.state.user.avatar ? this.state.user.avatar : AvatarDefault} className={this.state.isAvatarLoading ? 'avatar_image':''} circular />
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    {/* <Tab panes={panes} />           */}
                                </Grid.Column>
                              </Grid.Row>
                          }
                        </Grid>
                      </>
                    ): null               
                }
            </div>
        );
    }
}

export default Profile;