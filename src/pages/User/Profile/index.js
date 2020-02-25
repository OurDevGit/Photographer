import React, { Component } from 'react';
import MetaTags from 'react-meta-tags'
import { Grid, Form, Input, Select, TextArea, Button, Image} from 'semantic-ui-react'
// import PhotoList from '../../photo/PhotoList';
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

const TabPane = Tabs.TabPane;
const UserJson = {
    name: "Tatyana",
    username: "TatyanaPro",
    joinedAt: "2020.01.20",
    photoCount: 9,
    vodeCount: 10

};
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
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

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
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
        var url = URL.createObjectURL(e.target.files[0]);
        this.setState({
            user_avatar_url: url,
            uploadLabel: 'Change your photo'
        })
    }
      
    componentDidMount() {
        const username = this.props.match.params.username;
        // this.loadUserProfile(username);
        this.loadCurrentUser();
        this.setState({user: UserJson});
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }        
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
                                    <input type="file" accept="image/*" className="imageUpload input" name="file" onChange={this.uploadAvatar} />
                                    <Button className='imageUpload button'>{this.state.uploadLabel}</Button>
                                    <Image src={this.state.user_avatar_url} className='avatar_image' circular />
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
                                    />
                                    <Form.Field
                                        id='form-input-control-last-name'
                                        control={Input}
                                        label='Last name'
                                        placeholder='Last name'
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
                                        id='form-textarea-control-opinion'
                                        control={TextArea}
                                        label='Opinion'
                                        placeholder='Opinion'
                                    />
                                    <Form.Field
                                        id='form-input-control-error-email'
                                        control={Input}
                                        label='Email'
                                        placeholder='joe@schmoe.com'
                                        error={{
                                            content: 'Please enter a valid email address',
                                            pointing: 'below',
                                        }}
                                    />
                                    <Form.Field
                                        id='form-button-control-public'
                                        control={Button}
                                        content='Confirm'
                                        label='Label with htmlFor'
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