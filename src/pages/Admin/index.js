import React, { Component } from 'react'
import {
    Button,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Menu,
    Segment,
    Sidebar,
  } from 'semantic-ui-react'
import MetaTags from 'react-meta-tags'
import { getCurrentUser, getAllCategories } from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';
import { HomeHeader, SearchBar, PhotoList } from '../../components'
import './style.less'
import VerticalSidebar from './VerticalSidebar'
import Users from './Users'
import {notification} from 'antd'
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      visible: ''
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this)
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
    // this.loadAllCategories();
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

  handleMenuClick(e){
      this.setState({
          visible: e
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
            {/* <Sidebar.Pushable as={Segment}> */}
                <Grid.Column width='3'>
                    <VerticalSidebar 
                        animation = ""
                        direction= 'left'
                        visible =  'true'
                        handleMenuClick = {this.handleMenuClick}
                    />
                </Grid.Column>
                <Grid.Column width='13'>
                    <div className='admin_content'>
                    <Users 
                        visible = {this.state.visible == 'Users'}
                    />
                    </div>
                </Grid.Column>

            {/* </Sidebar.Pushable> */}
          </Grid.Row>
        </Grid>
      </>
    )
  }
}
export default Admin
