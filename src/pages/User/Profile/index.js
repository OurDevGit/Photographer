import React, { Component } from 'react';
import MetaTags from 'react-meta-tags'
import { Grid, GridColumn, Image, Divider } from 'semantic-ui-react'
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
            isLoading: false
        }

        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
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
      
    componentDidMount() {
        const username = this.props.match.params.username;
        // this.loadUserProfile(username);
        this.loadCurrentUser();
        this.setState({user: UserJson});
        console.log(this.state.user);
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
                            <Grid.Column width={16}>              
                                <UserCard user={this.state.user} />
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={16}>              
                              <Footer />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </>
                    ): null               
                }
            </div>
        );
    }
}

export default Profile;