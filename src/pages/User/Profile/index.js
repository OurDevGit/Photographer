import React, { Component } from 'react';
import MetaTags from 'react-meta-tags'
import { Grid, Form, Input, Select, TextArea, Button, Image} from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { API_BASE_URL, ACCESS_TOKEN} from '../../../constants';
import { getUserProfile, getCurrentUser } from '../../../util/APIUtils';
import {  Tabs } from 'antd';
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
import {getUserDetail} from '../../../util/APIUtils'
const TabPane = Tabs.TabPane;
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

    loadUserProfile(userId) {
        this.setState({
            isLoading: true
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
      
    componentDidMount() {
        const userId = this.props.match.params.id;
        this.loadUserProfile(userId);
        this.loadCurrentUser();
    }

    componentDidUpdate(nextProps) {
        // if(this.props.match.params.username !== nextProps.match.params.username) {
        //     this.loadUserProfile(nextProps.match.params.username);
        // }        
    }

    render() {
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
            return <Redirect to='/user/login' />
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

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
                                <Form>
                                    <Form.Group widths='equal'>
                                    <Form.Field
                                        id='form-input-control-first-name'
                                        control={Input}
                                        label='First name'
                                        placeholder='First name'
                                        value= {this.state.user.username}
                                    />
                                    <Form.Field
                                        id='form-input-control-last-name'
                                        control={Input}
                                        label='Last name'
                                        placeholder='Last name'
                                        value= {this.state.user.surname}
                                    />
                                    <Form.Field
                                        control={Select}
                                        // options={genderOptions}
                                        label={{ children: 'Gender', htmlFor: 'form-select-control-gender' }}
                                        placeholder='Gender'
                                        search
                                        searchInput={{ id: 'form-select-control-gender' }}
                                    />
                                    </Form.Group>

                                    <Form.Field
                                        id='form-input-control-error-email'
                                        control={Input}
                                        label='Email'
                                        placeholder='joe@schmoe.com'
                                        error={{
                                            content: 'Please enter a valid email address',
                                            pointing: 'below',
                                        }}
                                        value= {this.state.user.email}
                                    />
                                    <Form.Field
                                        id='form-textarea-control-opinion'
                                        control={TextArea}
                                        label='About me'
                                        placeholder='About me'
                                    />
                                    <Form.Field
                                        id='form-button-control-public'
                                        control={Button}
                                        content='Save'
                                    />
                                </Form>
                            </Grid.Column>
                          </Grid.Row>
                          {/* <Grid.Row>
                            <Grid.Column width={16}>              
                              <Footer />
                            </Grid.Column>
                          </Grid.Row> */}
                        </Grid>
                      </>
                    ): null               
                }
            </div>
        );
    }
}

export default Profile;