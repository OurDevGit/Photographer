import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon, Tab } from 'semantic-ui-react'
import { login, FBLogin } from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';
import './style.less'
import {notification } from 'antd';
import Login from './Login'
import SignUp from './SignUp'

class LoginAndSignUp extends Component{
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: {
          value: ''
      },
      password: {
          value: ''
      },
      title: "Login to your account",
      falg: false,
      isLoading: false
    }
    this.handleTabChange =  this.handleTabChange.bind(this)
    this.OpenLoginTab =  this.OpenLoginTab.bind(this)
    this.SocialLogin = this.SocialLogin.bind(this)
  }

  OpenLoginTab(){
    this.setState({
      activeIndex: 0
    })
  }

  handleTabChange(e, data){
      console.log(data.activeIndex)
      if(data.activeIndex == 0)
      {
          this.setState({
              title: "Login to your account",
              activeIndex: 0
          })
      }else if(data.activeIndex == 1)
      {
          this.setState({
              title: "SignUp with your account",
              activeIndex: 1
          })
      }
  }

  SocialLogin(){
    this.setState({
      isLoading: true
    })
  }


  render(){
    const panes = [
        { menuItem: 'Login', render: () => <Tab.Pane><Login /></Tab.Pane> },
        { menuItem: 'SignUp', render: () => <Tab.Pane><SignUp onSuccess={this.OpenLoginTab} /></Tab.Pane> },
      ]
    if(this.state.flag){
      return(
        <Redirect to='/' />
      )
    }else{
      return(
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle' className="LoginPage">
          {/* <HomeHeader /> */}
          <Grid.Column width="16" style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
                {this.state.title}
            </Header>
            <Tab panes={panes} activeIndex={this.state.activeIndex} onTabChange={this.handleTabChange}/>
            <a href="https://api.picktur.com/api/user_social_management/fb_login" onClick={this.SocialLogin}><Button loading={this.state.isLoading} className='social face' color='facebook' fluid size='large'>
                <Icon name='facebook' /> Facebook Login
            </Button></a>
            <Button className='social insta' color='instagram' fluid size='large'>
                <Icon name='instagram' /> Instagram Login
            </Button>
          </Grid.Column>
        </Grid>
      )
    }
    
  }
}

export default LoginAndSignUp