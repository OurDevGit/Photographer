import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon, Tab } from 'semantic-ui-react'
import { login, FBLogin } from '../../util/APIUtils';
import { ACCESS_TOKEN } from '../../constants';
import './style.less'
import {notification } from 'antd';
import FacebookLoginWithButton from 'react-facebook-login'
import InstagramLogin from 'react-instagram-login'
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
      falg: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFBLogin = this.handleFBLogin.bind(this);
    this.handleTabChange =  this.handleTabChange.bind(this)
  }
  handleInputChange(event){
    const target = event.target;
    const inputName = target.name;        
    const inputValue = target.value;

    this.setState({
        [inputName] : {
            value: inputValue,
        }
    });
  }

  handleTabChange(e, data){
      console.log(data.activeIndex)
      if(data.activeIndex == 0)
      {
          this.setState({
              title: "Login to your account"
          })
      }else if(data.activeIndex == 1)
      {
          this.setState({
              title: "SignUp with your account"
          })
      }
  }

  handleSubmit(event) {
    event.preventDefault();   

    const loginRequest = {
        usernameOrEmail: this.state.usernameOrEmail.value,
        password: this.state.password.value
    };

    login(loginRequest)
    .then(response => {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        this.setState({flag: true});
    }).catch(error => {
        if(error.status === 401) {
            notification.error({
                message: 'Photoing App',
                description: 'Your Username or Password is incorrect. Please try again!'
            });                    
        } else {
            notification.error({
                message: 'Photoing App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });                                            
        }
    });
  }

  handleFBLogin(){
    console.log("dd")
    FBLogin()
    .then(response =>{
      console.log("ddd",response)
      if(response.ok)
      {
        response.text().then(result => {
          console.log(result.slice(9))
          const headers = new Headers({
            'Access-Control-Allow-Origin':'*',
          })
          var requestOptions = {
            method: 'GET',
            header: headers,
            redirect: 'follow'
          };
          fetch(result.slice(9), requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        //   window.location.assign(result.slice(9));
        
      })
      }
    })
    .catch(error=>{
      console.log(error)
    })
  }


  responseFacebook = (response) => {
    console.log(response);
  }
  
  componentClicked = () => {
    console.log( "Clicked!" )
  }

  responseInstagram = (response) => {
    console.log(response);
  }


  render(){
    const panes = [
        { menuItem: 'Login', render: () => <Tab.Pane><Login /></Tab.Pane> },
        { menuItem: 'SignUp', render: () => <Tab.Pane><SignUp /></Tab.Pane> },
      ]
    if(this.state.flag){
      return(
        <Redirect to='/' />
      )
    }else{
      return(
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          {/* <HomeHeader /> */}
          <Grid.Column width="16" style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
                {this.state.title}
            </Header>
            <Tab panes={panes} onTabChange={this.handleTabChange}/>
            {/* <FacebookLoginWithButton
                  appId="222223435486606"
                  // appId = '2719403554847722'
                  fields="name,email,picture"
                  onClick={this.componentClicked}
                  callback={this.responseFacebook}
                  icon="fa-facebook"/> */}
                {/* <div  className='InstagramButton'>
                    <InstagramLogin
                      clientId="2dfb02f4699b400bc1d6129e53344ee7"
                      buttonText="Login"
                      onSuccess={this.responseInstagram}
                      onFailure={this.responseInstagram}
                    />
                </div> */}
            <Button className='social face' color='facebook' fluid size='large' onClick={this.handleFBLogin}>
                <Icon name='facebook' /> Facebook Login
            </Button>
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